const chalk = require('chalk');

module.exports = {
	name: 'playerDisconnect',
	execute(player, reason) {
        let interaction = global.interaction;
        const { channel } = interaction.member.voice;
        player.queue.clear();
        player.destroy();
        
		console.log(`[${chalk.bold.greenBright('DEBUG')}] ${chalk.greenBright('player disconnect from Channel:')} ${channel.name} ${chalk.greenBright('Server:')} ${interaction.guild.name}${chalk.greenBright('(')}${player.guild}${chalk.greenBright(')')}`);
	},
};