const chalk = require('chalk');

module.exports = {
	name: 'playerDestroy',
	execute(player, reason) {
        let interaction = global.interaction;
		let guild = interaction.client.guilds.cache.get(player.guild);
		console.log(`[${chalk.bold.greenBright('DEBUG')}] ${chalk.greenBright('player destroy from')} ${chalk.greenBright('Server:')} ${guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);
	},
};