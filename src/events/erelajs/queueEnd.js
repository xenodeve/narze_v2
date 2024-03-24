const chalk = require('chalk');

module.exports = {
	name: 'queueEnd',
	execute(player, track, payload) {
		player.destroy();
	},
};