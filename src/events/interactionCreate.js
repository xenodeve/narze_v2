const chalk = require('chalk');
const { EmbedBuilder } = require('discord.js');
const config = require('../setting/config.json')

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

		const command = interaction.client.commands.get(interaction.commandName);

		if (interaction.isCommand()) {

			if (!command) return;

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'Error trying to executing this command.', ephemeral: true });
			}

			const TextChannel = interaction.guild.channels.cache.get(interaction.channelId);
			const userAvatar = interaction.user.displayAvatarURL();
			const voiceMember = interaction.member.voice

			// console.log(voiceMember)

			const embed = new EmbedBuilder()
                .setColor(config.embed_color)
                .setAuthor({ name: 'View User', iconURL: userAvatar, url: `https://discord.com/users/${interaction.user.id}` })
                .setDescription(`User: \`${interaction.user.tag}\`(\`${interaction.user.id}\`) \nUserChannel: \`${voiceMember.channel.name}\`(\`${voiceMember.channel.id}\`) \nCommand: \`${interaction.commandName}\`(\`${interaction.commandId}\`) \nChannel: \`${TextChannel.name}\`(\`${TextChannel.id}\`) \nServer: \`${interaction.guild.name}\`(\`${interaction.guild.id}\`)`)
				.setThumbnail(interaction.guild.iconURL())
                .setTimestamp();

            global.logChannel.send({ embeds: [embed], ephemeral: false });


			console.log(`[${chalk.bold.greenBright('COMMAND')}] ${interaction.user.tag} ${chalk.greenBright('Used')} ${interaction.commandName} ${chalk.greenBright('in')} ${interaction.guild.name}${chalk.greenBright('(')}${interaction.guild.id}${chalk.greenBright(')')}`);


		} else if (interaction.isAutocomplete()) {

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		}
	},
};