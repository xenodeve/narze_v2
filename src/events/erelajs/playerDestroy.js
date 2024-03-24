const chalk = require('chalk');

module.exports = {
	name: 'playerDestroy',
	execute(player, reason) {
		player_play = global.player;
		// console.log(`[DEBUG] Player Created from (${player.guild})`);
		console.log(`[${chalk.bold.greenBright('DEBUG')}] ${chalk.greenBright('player destroy from')} ${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);
	},
};