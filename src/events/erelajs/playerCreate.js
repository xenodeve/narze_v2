const chalk = require('chalk');

module.exports = {
	name: 'playerCreate',
	execute(player) {
		console.log(`[${chalk.bold.greenBright('DEBUG')}] ${chalk.greenBright('player create from')} ${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);
	},
};