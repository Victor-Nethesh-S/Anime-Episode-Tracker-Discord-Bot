const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const AniListAPI = require('../utils/anilist.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('airing-anime')
		.setDescription('Replies with all airing this season anime!'),
	async execute(interaction) {

		const animeList = await AniListAPI.allAnime();
		if (animeList.length === 0) {
			return interaction.reply('No anime airing this season.');
		}
		// Prepare the options for the Select Menu
		const options = animeList.slice(0, 25).map((anime) => ({
      
			label: anime.title.english || anime.title.romaji || anime.title.native,
			// Convert to string to avoid issues
			value: anime.id.toString(),
		}));

		// Create a Select Menu component
		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId('anime_select')
			.setPlaceholder('Select an anime...')
			.addOptions(options);

		// Create a Message Action Row containing the Select Menu
		const row = new ActionRowBuilder()
			.addComponents(selectMenu);

		// Send the message with the Select Menu
		await interaction.reply({ content: 'These are the anime airing this season:', components: [row] });
	},
};
