// trackStart.js
const { EmbedBuilder } = require('discord.js');
const config = require('../../setting/config.json');
const { convertTime } = require('../../structures/convertTime.js');
const chalk = require('chalk');

module.exports = {
    name: 'trackStart',
    async execute(player, tracks, payload) {

        let interaction = global.interaction;
        const { channel } = interaction.member.voice;
        const textChannel = interaction.guild.channels.cache.get(interaction.channelId)

        console.log(`[${chalk.bold.greenBright('LAVALINK')}] ${chalk.greenBright('Play')} ${tracks.title} ${chalk.greenBright('in Channel:')} ${channel.name} ${chalk.greenBright('Server:')} ${interaction.guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);

        const userAvatar = interaction.user.displayAvatarURL();
        const userMention = interaction.user.toString();
        console.log(player)
        const embed = new EmbedBuilder()
            .setColor(config.embed_color)
            .setAuthor({ name: 'Go to Page', iconURL: userAvatar, url: player.queue.current.uri })
            .setDescription(`▶️┃**${tracks.title}** \` ${convertTime(tracks.duration)} \` \n ขอโดย: ${userMention}`)
            .setThumbnail(player.queue.current.thumbnail)
            .setTimestamp();

        textChannel.send({ embeds: [embed], ephemeral: false });
    },
};
