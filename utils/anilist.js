const AniListAPI = {
	baseURL: 'https://graphql.anilist.co',
  // get a list of anime with the term used for searching
	async searchAnime(animeName) {
		try {
			const response = await fetch(this.baseURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: `
            query ($animeName: String) {
              Page {
                media(search: $animeName, type: ANIME, status_not: FINISHED) {
                  id
                  title {
                    romaji
                    english
                    native
                  }
                }
              }
            }

          `,
					variables: {
						animeName: animeName,
					},
				}),
			});

			const responseData = await response.json();
			const matchingAnime = responseData.data.Page.media;
			return matchingAnime;
		}
		catch (error) {
			console.error('Error searching for anime:', error);
			return [];
		}
	},
  // get the spicific anime details
	async getAnimeById(animeId) {
		try {
			const response = await fetch(this.baseURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: `
          query ($animeId: Int) {
            Media(id: $animeId, type: ANIME) {
              id
              title {
                romaji
                english
                native
              }
              nextAiringEpisode {
                id
                airingAt
                episode
              }
              description
              startDate {
                year
                month
                day
              }
              episodes
              status
              genres
              averageScore
              coverImage {
                medium
              }
              airingSchedule {
                nodes {
                  airingAt
                }
              }
            }
          }
        `,
					variables: {
						animeId: animeId,
					},
				}),
			});

			const responseData = await response.json();
			const animeDetails = responseData.data.Media;
			return animeDetails;
		}
		catch (error) {
			console.error('Error fetching anime details by ID:', error);
			return null;
		}
	},
  // get all animes that are currently relaesing this season
  async allAnime() {
		try {
			const response = await fetch(this.baseURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: `
            query {
              Page {
                media(type: ANIME, seasonYear: 2023, status: RELEASING, season: ${getCurrentSeason()}, sort: POPULARITY_DESC) {
                  id
                  title {
                    romaji
                    english
                  }
                  startDate {
                    year
                    month
                    day
                  }
                  status
                  averageScore
                  popularity
                }
              }
            }

          `,
				}),
			});

			const responseData = await response.json();
			const matchingAnime = responseData.data.Page.media;
			return matchingAnime;
		}
		catch (error) {
			console.error('Error searching for anime:', error);
			return [];
		}
	}

};

function getCurrentSeason() {
  // Get the current month (0 - January, 11 - December)
  const currentMonth = new Date().getMonth();
  if (currentMonth >= 12 || currentMonth <= 2) {
    return 'WINTER';
  } else if (currentMonth >= 3 && currentMonth <= 5) {
    return 'SPRING';
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    return 'SUMMER';
  } else {
    return 'FALL';
  }
}

module.exports = AniListAPI;
