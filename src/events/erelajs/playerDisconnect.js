const chalk = require('chalk');

module.exports = {
	name: 'playerDisconnect',
	execute(player, reason) {
        const { channel } = interaction.member.voice;
        player.queue.clear();
		console.log(`[${chalk.bold.greenBright('DEBUG')}] ${chalk.greenBright('player disconnect from Channel:')} ${channel.name} ${chalk.greenBright('Server:')} ${interaction.guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);
        player.destroy();
	},
};