const { SlashCommandBuilder } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list-anime')
		.setDescription('Replies with list of tracking anime!'),
	async execute(interaction) {
    let animes = await db.get("animes");
    if(animes && animes.length > 0){
      message = ""
      for ( anime of animes){
        message += anime.name + " - "
        const t = new Date(anime.next.airingAt * 1000);
        
        message += t.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', // Specify the IST time zone
          }) + "\n"
      }
  		await interaction.reply(message);
    } else {
      await interaction.reply("The list is Empty");
    }
	},
};