const chalk = require('chalk');

module.exports = {
	name: 'playerMove',
	execute(player, oldChannelId, newChannelId) {
        let interaction = global.interaction || global.joinInteraction;
        const old_Channel = interaction.guild.channels.cache.get(oldChannelId)
        const new_Channel = interaction.guild.channels.cache.get(newChannelId)
		console.log(`[${chalk.bold.greenBright('LAVALINK')}] ${chalk.greenBright('player moved from')} ${old_Channel.name} ${chalk.greenBright('to')} ${chalk.greenBright('New Channel:')} ${new_Channel.name} ${chalk.greenBright('Server:')} ${new_Channel.guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);
	},
};