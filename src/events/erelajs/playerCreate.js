const chalk = require('chalk');

module.exports = {
	name: 'playerCreate',
	execute(player) {
		let interaction = global.autoInteraction || global.joinInteraction;
		let guild = interaction.client.guilds.cache.get(player.guild);
		console.log(`[${chalk.bold.greenBright('DEBUG')}] ${chalk.greenBright('player create from')} ${chalk.greenBright('Server:')} ${guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);
	},
};