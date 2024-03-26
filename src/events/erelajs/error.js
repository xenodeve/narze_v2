const chalk = require('chalk');

module.exports = {
	name: 'error',
	execute(client, node, error, payload) {
        console.log(`[${chalk.bold.redBright('ERR')}] Errored ${client.user.tag}'('${client.user.id}) ${chalk.redBright(error)}${chalk.redBright(' ')}`);
	},
};