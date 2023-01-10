const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

//each embed field has a character limit found here: https://www.pythondiscord.com/pages/guides/python-guides/discord-embed-limits/
//this function trims the passed in string if it exceeds the passed in character limit
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gi')
        .setDescription('Provides basic information about a specified Genshin Impact character.')
        .addStringOption(option => option.setName('input').setDescription('The character to search for').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const searchTerm = interaction.options.getString('input');
        const uri = `https://api.genshin.dev/characters/${searchTerm}`;

        fetch(uri)
            .then((response) => response.json())
            .then((data) => {
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(data.name)
                    .setDescription(data.description)
                    .addFields(
                        { name: 'Nation', value: data.nation },
                        { name: 'Vision', value: data.vision, inline: true },
                        { name: 'Rarity (Stars)', value: data.rarity.toString(), inline: true },
                        { name: 'Weapon Type', value: data.weapon, inline: true },
                        { name: '\u200B', value: ' ' },
                        { name: 'Skills', value: ' ' }
                    );
                data.skillTalents.forEach(skill => {
                    embed.addFields({ name: `${skill.name} (${skill.unlock})`, value: trim(skill.description, 1024) })
                });

                embed.addFields({ name: '\u200B', value: ' ' });
                embed.addFields({ name: 'Passive Talents', value: ' ' });
                data.passiveTalents.forEach(passive => {
                    embed.addFields({ name: `${passive.name} (${passive.unlock})`, value: trim(passive.description, 1024) })
                });

                embed.addFields({ name: '\u200B', value: ' ' });
                embed.addFields({ name: 'Constellations', value: ' ' });
                data.constellations.forEach(constellation => {
                    embed.addFields({ name: `${constellation.unlock}: ${constellation.name}`, value: trim(constellation.description, 1024) })
                });

                interaction.editReply({ embeds: [embed] });
            })
            .catch((err) => {
                console.error(err);
            });
    },
};