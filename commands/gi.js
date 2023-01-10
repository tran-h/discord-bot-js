const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

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
                    .setColor(0x00fbff)
                    .setTitle(data.name)
                    .setDescription(data.description)
                    .addFields(
                        { name: 'Nation', value: data.nation },
                        { name: 'Vision', value: data.vision, inline: true },
                        { name: 'Rarity (Stars)', value: data.rarity.toString(), inline: true },
                        { name: 'Weapon Type', value: data.weapon, inline: true }
                    )
                interaction.editReply({ embeds: [embed] });
            })
            .catch((err) => {
                console.error(err);
            });
    },
};