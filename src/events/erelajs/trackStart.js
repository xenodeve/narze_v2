// trackStart.js
const { EmbedBuilder } = require('discord.js');
const config = require('../../setting/config.json');
const { convertTime } = require('../../structures/convertTime.js');
const chalk = require('chalk');

module.exports = {
    name: 'trackStart',
    async execute(player, track, payload) {

        let interaction = global.interaction;
        const { channel } = interaction.member.voice;
        const textChannel = interaction.guild.channels.cache.get(interaction.channelId)

        console.log(player)

        console.log(`[${chalk.bold.greenBright('LAVALINK')}] ${chalk.greenBright('Play')} ${track.title} ${chalk.greenBright('in Channel:')} ${channel.name} ${chalk.greenBright('Server:')} ${interaction.guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);

        const userAvatar = interaction.user.displayAvatarURL();
        if (player.get('firstsong') === false && track.isStream === false) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setAuthor({ name: 'Go to Page', iconURL: userAvatar, url: player.queue.current.uri })
                .setDescription(`\`▶️\`┃**${track.title}** \` ${convertTime(track.duration)} \``)
                .setThumbnail(track.thumbnail)
                .setTimestamp();

            return textChannel.send({ embeds: [embed], ephemeral: false });
        } else if (track.isStream === true) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setAuthor({ name: 'Go to Live', iconURL: userAvatar, url: track.uri })
                .setDescription(`\`🔴\`┃**${track.title}**`)
                .setThumbnail(track.thumbnail)
            return textChannel.send({ embeds: [embed] });
        }
        player.set('firstsong', false)
    },
};
