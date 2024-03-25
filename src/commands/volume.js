const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../setting/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('ปรับความดัง')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('ความดัง (%)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(1000)
        ),
    async execute(interaction) {
        
        const player = interaction.client.manager.get(interaction.guild.id);

        if (!player) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` ไม่มีบอทในห้อง`);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!player.playing) {
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

        const value = interaction.options.getInteger('amount');

        if (!value) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setDescription(`> \`📢\`┃**เสียง:** \`${player.volume}%\``);

            return interaction.reply({ embeds: [embed] });
        }

        await player.setVolume(value);

        const embed = new EmbedBuilder()
            .setColor(config.embed_color)
            .setDescription(`> \`📢\`┃**เสียง:** \`${value}%\``);
            
        return interaction.reply({ embeds: [embed] });
    }
}