const Database = require('@replit/database');
const db = new Database();
const schedule = require('node-schedule');
const AniListAPI = require('../utils/anilist.js');
const AnimeDB = require('../utils/AnimeDB.js');
const { channelId } = require('../config.json');

const AnimeSchedule = {
	async scheduleAllAnime(client) {
		try {
			await schedule.gracefulShutdown().then(async () => {
				await AnimeDB.update();
				let animes = await db.get('animes');
				if (!animes) {
					animes = [];
				}
				if (!(animes && animes.length > 0)) {
					console.log('no anime to track');
					return 'failed';
				}
				let nextEpisode = animes[0];
				const t = new Date(nextEpisode.next.airingAt * 1000);
				if (t > new Date()) {
					const job = schedule.scheduleJob(t, async function () {
						channel = client.channels.cache.get(channelId);
						channel.send({
							content: `${nextEpisode.name} - episode ${nextEpisode.next.episode} has been released`,
						});

						await AnimeSchedule.scheduleAllAnime(client);
					});
				}
			});
			console.log('schedule successfull');
			return 'success';
		} catch (error) {
			// Handle any errors that may occur during database operations
			console.error('Error adding anime:', error);
			throw error; // Re-throw the error for further handling
		}
	},
};

module.exports = AnimeSchedule;
