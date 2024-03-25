const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../setting/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('ออกห้องเสียง'),
    async execute(interaction) {

        const { channel } = interaction.member.voice;
        const player = interaction.client.manager.get(interaction.guild.id)

        if (!player || typeof player === 'undefined') {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` ไม่มีบอทในห้อง`);

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
        
        if (player) {
            await player.destroy();

            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setDescription(`> \`🔊\`| ออกจากห้อง ${channel.toString()}`)

            return interaction.reply({ embeds: [embed] });
        }

    }
};