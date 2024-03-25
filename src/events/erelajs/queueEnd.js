module.exports = {
	name: 'queueEnd',
	execute(player, track, payload) {

		if(player.twentyFourSeven === true) return;
		player.destroy();
	},
};