const chalk = require('chalk');

module.exports = {
	name: 'playerDestroy',
	execute(player, reason) {
        const { channel } = interaction.member.voice;
		console.log(`[${chalk.bold.greenBright('DEBUG')}] ${chalk.greenBright('player disconnect from Channel:')} ${channel.name} ${chalk.greenBright('Server:')} ${interaction.guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);
	},
};