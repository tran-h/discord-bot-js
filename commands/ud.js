const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ud')
		.setDescription('Provides the top definition for the provided term from UrbanDictionary.')
		.addStringOption(option => option.setName('input').setDescription('The term to search for on UrbanDictionary').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const term = interaction.options.getString('input');
		const query = new URLSearchParams({ term });
		const uri = `https://api.urbandictionary.com/v0/define?${query}`;

		fetch(uri)
			.then((response) => response.json())
			.then((data) => {
				const { list } = data;
				if (!list.length) {
					return interaction.editReply(`No results found for **${term}**.`);
				}
				const [answer] = list;
				const embed = new EmbedBuilder()
					.setColor(0xEFFF00)
					.setTitle(answer.word)
					.setURL(answer.permalink)
					.addFields(
						{ name: 'Definition', value: trim(answer.definition, 1024) },
						{ name: 'Example', value: trim(answer.example, 1024) },
						{
							name: 'Rating',
							value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
						},
					);
				interaction.editReply({ embeds: [embed] });
			})
			.catch((error) => {
				console.error(error);
			});
	},
};