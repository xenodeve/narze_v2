const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../setting/config.json')
const { convertTime } = require('../structures/convertTime');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipplay')
        .setDescription('ลัดคิวเล่นทันที')
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
        let player = await interaction.client.manager.get(interaction.guild.id)

        let choice = [];

        if (!player) {
            choice.push({ name: 'ไม่มีเพลงก่อนหน้า ไม่สามารถใช้ skipplay ได้', value: 'nobeforsong_error' });
        } else if (!query) {
            choice.push({ name: 'กรุณาระบุเพลง', value: 'no_song' });
        } else if (query.startsWith('https://')) {
            if (query.includes('deezer') || query.includes('music.apple')) {
                choice.push({ name: 'ไม่รองรับ Platform นี้', value: 'deezer, music.apple' });
            } else {
                let result = await player.search(query, interaction.author)

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
        let player = await interaction.client.manager.get(interaction.guild.id);

        console.log('')

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
        } else if (interaction.member.voice.channel.id !== player.voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` คุณต้องอยู่ในห้องเดียวกับบอท`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (query.includes('deezer') || query.includes('music.apple')) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\`ไม่รองรับ Platform นี้`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!player || !player.queue.current || query === 'nobeforsong_error') {
            const embed = new EmbedBuilder()
                .setDescription(`> \`❌\`ไม่มีเพลงก่อนหน้า`)
                .setColor(config.embed_fail);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const res = await player.search(query, interaction.author)

        if (!res.tracks[0]) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` ไม่สามารถเข้าถึงเพลงได้`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: false });
        const userAvatar = interaction.user.displayAvatarURL();

        console.log('player.queue', player.queue)
        const backup = player.queue
        await player.queue.clear();
        await player.queue.add(res.tracks[0]);
        player.queue.add(backup);

        // สร้าง Embed และแสดงผล
        const embed = new EmbedBuilder()
            .setColor(config.embed_color)
            .setAuthor({ name: 'Go to Page', iconURL: userAvatar, url: res.tracks[0].uri })
            .setDescription(`\`▶️\`┃**${res.tracks[0].title}** \` ${convertTime(res.tracks[0].duration)} \``)
            .setThumbnail(res.tracks[0].thumbnail)

        return interaction.editReply({ embeds: [embed] });
    }
}