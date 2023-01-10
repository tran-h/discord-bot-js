const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Nyaa!'),
	async execute(interaction) {
		await interaction.deferReply();
		
		fetch('https://aws.random.cat/meow')
			.then((response) => response.json())
			.then((data) => {
				const { file } = data;
				interaction.editReply({ files: [file] });
			})
			.catch((error) => {
				console.error(error);
			});
	},
};