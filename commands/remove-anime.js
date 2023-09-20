const { SlashCommandBuilder } = require('discord.js');
const AnimeDB = require('../utils/AnimeDB')
const AnimeSchedule = require('../utils/scheduleAnime.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove-anime')
		.setDescription('remove the anime from the tracking list.')
    .addStringOption(option =>
			option.setName('anime_name')
				.setDescription('Enter the name of the anime.')
				.setRequired(true)),
	async execute(interaction) {
      const animeName = interaction.options.getString('anime_name');
      status = await AnimeDB.delete(animeName);
      if(status === "success"){
        await interaction.reply(`${animeName} has been deleted.`);      
        await AnimeSchedule.scheduleAllAnime(interaction.client)
      } else {
        await interaction.reply(`Failed to delete.`);
      }
    }
	};