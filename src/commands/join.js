const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../setting/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('เข้าห้อง'),
    async execute(interaction) {

        global.joinInteraction = interaction;

        const { channel } = interaction.member.voice;

        let player = global.player || interaction.client.manager.create({
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

        let player_channel = interaction.guild.channels.cache.get(player.voiceChannel)


        if (player.state == 'DISCONNECTED') {
            try {
                await player.connect();
            } catch (error) {
                const embed = new EmbedBuilder()
                    .setColor(config.embed_fail)
                    .setDescription(`> \`❌\` บอทไม่มีอำนาจเข้าห้อง ${player_channel.toString()}`);

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setDescription(`> \`🔊\`| เข้าห้อง ${player_channel.toString()}`)

            return interaction.reply({ embeds: [embed] });
        } else if (player.state == 'CONNECTED') {

            const embed = new EmbedBuilder()
                .setColor(config.embed_fail)
                .setDescription(`> \`🔊\`| เข้าห้อง ${player_channel.toString()} อยู่แล้ว`)

            return interaction.reply({ embeds: [embed], ephemeral:true });
        }
    }
};