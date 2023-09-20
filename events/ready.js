const { Events } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();
const AnimeSchedule = require('../utils/scheduleAnime.js')

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
    await AnimeSchedule.scheduleAllAnime(client)
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};