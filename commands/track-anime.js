const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const AniListAPI = require('../utils/anilist.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('track-anime')
		.setDescription('Replies with anime data!')
		.addStringOption(option =>
			option.setName('anime_name')
				.setDescription('Enter the name of the anime.')
				.setRequired(true)),
	async execute(interaction) {
		const animeName = interaction.options.getString('anime_name');

		if (!animeName) {
			return interaction.reply('Please provide the name of the anime.');
		}

		const animeList = await AniListAPI.searchAnime(animeName);
		if (animeList.length === 0) {
			return interaction.reply('No currently airing anime matching your search was found.');
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
		await interaction.reply({ content: 'Here are the matching anime:', components: [row] });
    
	},
};
