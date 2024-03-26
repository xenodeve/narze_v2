// trackStart.js
const { EmbedBuilder } = require('discord.js');
const config = require('../../setting/config.json');
const { convertTime } = require('../../structures/convertTime.js');
const chalk = require('chalk');

module.exports = {
    name: 'trackStart',
    async execute(player, track, payload) {

        const interaction = global.interaction;
        const guild = await interaction.client.guilds.cache.get(player.guild);
        const { channel } = await interaction.member.voice;

        console.log('player :', player)

        if (!guild) return;
        const textChannel = await guild.channels.cache.get(player.textChannel);
        if (!textChannel || !track) return;

        // console.log('firstsong', player.get('firstsong'))
        // console.log('track.isStream', track.isStream)

        console.log(`[${chalk.bold.greenBright('LAVALINK')}] ${chalk.greenBright('Play')} ${track.title} ${chalk.greenBright('in Channel:')} ${channel.name} ${chalk.greenBright('Server:')} ${interaction.guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);

        const userAvatar = interaction.user.displayAvatarURL();
        if ((player.get('firstsong') === false || player.get('firstsong') === undefined) && track.isStream === false) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setAuthor({ name: 'Go to Page', iconURL: userAvatar, url: player.queue.current.uri })
                .setDescription(`\`▶️\`┃**${track.title}** \` ${convertTime(track.duration)} \``)
                .setThumbnail(track.thumbnail)
                .setTimestamp();

            textChannel.send({ embeds: [embed], ephemeral: false });
        } else if (track.isStream === true) {
            const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setAuthor({ name: 'Go to Live', iconURL: userAvatar, url: track.uri })
                .setDescription(`\`🔴\`┃**${track.title}**`)
                .setThumbnail(track.thumbnail)
            textChannel.send({ embeds: [embed] });
        }
        player.set('firstsong', false)
    },
};
