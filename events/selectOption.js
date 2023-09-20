const { Events } = require('discord.js');
const AniListAPI = require('../utils/anilist.js');
const AnimeDB = require('../utils/AnimeDB')
const AnimeSchedule = require('../utils/scheduleAnime.js')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isStringSelectMenu()) return;
		if (interaction.customId === 'anime_select') {
			const selectedAnimeId = interaction.values[0];
			// Fetch details of the selected anime based on its ID
			const animeDetails = await AniListAPI.getAnimeById(selectedAnimeId);
			if (animeDetails) {
        status = await AnimeDB.add({
          name: animeDetails.title.english || animeDetails.title.romaji || animeDetails.title.native,
          id: animeDetails.id
        });
        if(status === "success"){
          await interaction.reply(`${animeDetails.title.english || animeDetails.title.romaji || animeDetails.title.native} has been added.`
          );
          status = await AnimeSchedule.scheduleAllAnime(interaction.client)
        } else {
          await interaction.update(`Failed to add.`);
        }
			}
			else {
				await interaction.update('An error occurred while fetching anime details.');
			}
		}

	},
};