const chalk = require('chalk');

module.exports = {
	name: 'playerMove',
	execute(player, oldChannelId, newChannelId) {
		player_play = global.player;
		// console.log(`[DEBUG] Player Created from (${player.guild})`);
		console.log(`[${chalk.bold.greenBright('LAVALINK')}] ${chalk.greenBright('player move from')} ${oldChannelId.name} ${chalk.greenBright('to')} ${chalk.greenBright('New Channel:')} ${newChannelId.name} ${chalk.greenBright('Server:')} ${player.guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);
	},
};