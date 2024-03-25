const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../setting/config.json');
const { convertTime}  = require('../structures/convertTime.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('พัก'),
    async execute(interaction) {
        const player = interaction.client.manager.get(interaction.guild.id)

        if (!player) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` ไม่มีบอทในห้อง`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!player.queue.current) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` ไม่มีเพลงที่เล่นอยู่`);

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
        }

        const userAvatar = interaction.user.displayAvatarURL();

        await player.pause(player.playing);

        const pause = player.get('pause');
        if (pause === true) {
            await player.set('pause', false);

            const embed = new EmbedBuilder()
            .setColor(config.embed_color)
            .setAuthor({ name: 'Go to Page', iconURL: userAvatar, url: player.queue.current.uri})
            .setDescription(`\`▶️\`┃**${player.queue.current.title}** \` ${convertTime(player.queue.current.duration)} \``)
            .setThumbnail(player.queue.current.thumbnail)
            .setFooter({ text: 'เล่นต่อ' })

            // return interaction.editReply({ embeds: [embed] });
            return interaction.reply({ embeds: [embed] });
        } else {            
            
            await player.set('pause', true);

            const embed = new EmbedBuilder()
            .setColor(config.embed_color)
            .setAuthor({ name: 'Go to Page', iconURL: userAvatar, url: player.queue.current.uri})
            .setDescription(`\`⏸️\`┃**${player.queue.current.title}** \` ${convertTime(player.queue.current.duration)} \``)
            .setThumbnail(player.queue.current.thumbnail)
            .setFooter({ text: 'พักการเล่น' })
            
            return interaction.reply({ embeds: [embed] });
        }
    }
}