const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../setting/config.json')
const { convertTime } = require('../structures/convertTime');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('เล่น | เพิ่มคิว')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('ชื่อเพลง | ลิ้งก์')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(interaction) {

        global.autoInteraction = interaction;
        const query = interaction.options.getString('query');
        let player = await interaction.client.manager.get(interaction.guild.id) || await interaction.client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            region: config.region,
            selfDeafen: config.selfDeafen
        });

        let choice = [];

        if (!query) {
            choice.push({ name: 'กรุณาระบุเพลง', value: 'no_song' });
        } else if (query.startsWith('https://')) {
            if (query.includes('deezer') || query.includes('music.apple')) {
                choice.push({ name: 'ไม่รองรับ Platform นี้', value: 'deezer, music.apple' });
            } else {
                let result = await player.search(query, interaction.author)

                console.log('res 1 :', result)

                if (result.loadType === 'error' || result.loadType === 'empty') {
                    title = `(ข้อผิดพลาด) กรุณาใส่ URL ที่ถูกต้อง`;
                    choice.push({ name: title, value: 'error' });
                } else if (result.playlist) {
                    console.log(result)
                    const title = `(${result.tracks.length} เพลง) ${result.playlist.name}`
                    choice.push({ name: title, value: query });
                } else {
                    const title = `(${result.tracks[0].author}) ${result.tracks[0].title}`
                    choice.push({ name: title, value: query });
                }
            }
        } else {
            // console.log('10')
            await player.search(query, interaction.author).catch(error => {
                {
                    // จัดการกับ error ที่เกิดขึ้น
                    console.error(error);
                }
            }).then(results => {
                for (let i = 0; i < 7; i++) {
                    const title = `(${results.tracks[i].author}) ${results.tracks[i].title}`;
                    let url = results.tracks[i].uri;
                    choice.push({ name: title, value: url });
                }
            }).catch(() => { });
        }
        await interaction.respond(choice).catch(() => { });
    },
    async execute(interaction) {
        global.interaction = interaction;
        
        const query = interaction.options.getString('query');
        const { channel } = interaction.member.voice;
        const memberVoiceChannel = interaction.member.voice.channel;
        const permissions = memberVoiceChannel.permissionsFor(interaction.client.user); // ตรวจสอบ Permissions ในห้องเสียง

        if (!query || query === 'no_song') {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\`กรุณาระบุเพลง`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (query === 'error') {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\`กรุณาระบุเพลงที่ถูกต้อง`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!interaction.member.voice.channel) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` กรุณาเข้าห้องเสียงด้วย`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (query.includes('deezer') || query.includes('music.apple')) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\`ไม่รองรับ Platform นี้`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let player = await interaction.client.manager.get(interaction.guild.id) || await interaction.client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            region: config.region,
            selfDeafen: config.selfDeafen
        });

        if (!player.voiceChannel) {
            await player.destroy()
            player = await interaction.client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                region: config.region,
                selfDeafen: config.selfDeafen
            });
        }

        const res = await player.search(query, interaction.author)

        console.log('res 2 :', res)

        if (interaction.member.voice.channel.id !== player.voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` คุณต้องอยู่ในห้องเดียวกับบอท`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!res.tracks[0]) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` ไม่สามารถเข้าถึงเพลงได้`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!permissions.has(PermissionsBitField.Flags.Connect) || !permissions.has(PermissionsBitField.Flags.Speak)) {
            player.destroy();
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` บอทไม่มีอำนาจเปิดเพลงในห้อง ${channel.toString()}`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: false });


        function F_Join_Play() {
            if (!player.playing) {
                player.connect();
                player.play();
            }
        }

        // console.log(res)

        const userAvatar = interaction.user.displayAvatarURL();

        player.set('firstsong', false)
        if (!player.playing && !player.paused && !player.queue.size && !res.playlist && res.tracks[0].isStream === false) {
            await player.queue.add(res.tracks[0]);

            player.set('firstsong', true)

            F_Join_Play();

            // สร้าง Embed และแสดงผล
            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setAuthor({ name: 'Go to Page', iconURL: userAvatar, url: res.tracks[0].uri })
                .setDescription(`\`▶️\`┃**${res.tracks[0].title}** \` ${convertTime(res.tracks[0].duration)} \``)
                .setThumbnail(res.tracks[0].thumbnail)

            return interaction.editReply({ embeds: [embed] });

        } else if (player.playing && !res.playlist && res.tracks[0].isStream === false) {
            await player.queue.add(res.tracks[0]);


            // สร้าง Embed และแสดงผล
            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setAuthor({ name: 'Go to Page', iconURL: userAvatar, url: res.tracks[0].uri })
                .setDescription(`\`📝\`┃**${res.tracks[0].title}** \` ${convertTime(res.tracks[0].duration)} \` \n ลำดับ: \` ${player.queue.size} \``)
                .setThumbnail(res.tracks[0].thumbnail)
            return interaction.editReply({ embeds: [embed] });

        } else if (res.playlist) {
            // ถ้าเป็น playlist
            // console.log(res)
            await player.queue.add(res.tracks)
            F_Join_Play();

            let thumbnail;

            if (!res.playlist.thumbnail) {
                thumbnail = res.tracks[0].thumbnail;
            } else {
                thumbnail = res.playlist.thumbnail;
            }

            if (res.playlist) {
                const embed = new EmbedBuilder()
                    .setColor(config.embed_color)
                    .setAuthor({ name: 'Go to Playlist', iconURL: userAvatar, url: query })
                    .setDescription(`> \`🎵\` **Playlist:** ${res.playlist.name}\n> \`⌛\` **เวลา:** \` ${convertTime(res.playlist.duration)} \` \n> \`📊\` **มี:** \` ${res.tracks.length} \` เพลง \n> **ห้อง:** ${channel.toString()}`)
                    .setThumbnail(thumbnail);

                return interaction.editReply({ embeds: [embed], ephemeral: false });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(config.embed_fail)
                    .setDescription(`> \`❌\` ไม่สามารถดึงข้อมูลเพลย์ลิสต์ได้.`);

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } else if (res.tracks[0].isStream === true) {

            await player.queue.add(res.tracks[0])

            F_Join_Play();

            // สร้าง Embed และแสดงผล
            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setAuthor({ name: 'Go to Live', iconURL: userAvatar, url: query })
                .setDescription(`\`🔴\`┃**${res.tracks[0].title}**`)
                .setThumbnail(res.tracks[0].thumbnail)
            return interaction.editReply({ embeds: [embed] });
        }
    }
}