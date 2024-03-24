const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const config = require('../setting/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('ข้าม'),

    async execute(interaction) {
        // const userAvatar = res.tracks[0].requester.displayAvatarURL();

        const player = interaction.client.manager.get(interaction.guild.id)

        if (!player) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`❌\` ไม่มีเครื่องเล่น`);

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

        if (player.queue.size === 0) {
            if (!player.twentyFourSeven) {
                player.twentyFourSeven = false
            }
            
            if (player.twentyFourSeven === false){
                player.destroy();
            };

            const embed = new EmbedBuilder()
                .setDescription(`\`⏭️\`┃ **ไม่เหลือเพลงให้ข้าม**`)
                .setColor(config.embed_fail)
                .setFooter({ text: 'ข้าม • เพิ่มคิวอัตโนมัติ' });

            return interaction.reply({ embeds: [embed] });
        } else {
            await player.stop();
            const userMention = interaction.user.toString();

            const embed = new EmbedBuilder()
                .setDescription(`\`⏭️\`┃**Skipped** โดย: ${userMention}`)
                .setColor(config.embed_color)

            return interaction.reply({ embeds: [embed] });
        }
    }
}