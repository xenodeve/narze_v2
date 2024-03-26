const chalk = require('chalk');

module.exports = {
	name: 'nodeErrorr',
	execute(node, error) {
		console.log(`[${chalk.bold.redBright('ERR')}] ${node.options.identifier} ${chalk.redBright(error)}`);
	},
};