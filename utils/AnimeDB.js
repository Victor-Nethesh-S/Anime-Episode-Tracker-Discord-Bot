const Database = require("@replit/database");
const db = new Database();
const AniListAPI = require('../utils/anilist.js');
const animedb = {
   async add(anime) {
    try {
      let animes = await db.get("animes");

      if (!animes) {
        animes = [];
      }
      for(a of animes){
        if(a.name == anime.name){
          return "success"
        }
      }
      animes.push(anime);
      await db.set("animes", animes);
      return "success"
    } catch (error) {
      // Handle any errors that may occur during database operations
      console.error("Error adding anime:", error);
      throw error; // Re-throw the error for further handling
    }
  },
  async delete(animeToDelete) {
    try {
      let animes = await db.get("animes");
      if (!animes) {
        animes = [];
      }
  
      // Find the index of the anime to delete
      const indexToDelete = animes.findIndex((anime) => anime.name.toLowerCase() === animeToDelete.toLowerCase());
  
      if (indexToDelete !== -1) {
        // Remove the anime from the list
        animes.splice(indexToDelete, 1);
        await db.set("animes", animes);
        return "success"
      }
      return "failed"
    } catch (error) {
      // Handle any errors that may occur during database operations
      console.error("Error deleting anime:", error);
      throw error; // Re-throw the error for further handling
    }
    
  },
  async update() {
    try {
      let animes = await db.get("animes");
      if (!animes) {
        animes = [];
      }
      const result = await Promise.all(animes.map(async (anime) => {
        const aniData = await AniListAPI.getAnimeById(anime.id);
          return {
            ...anime,
            status: aniData.status,
            next: aniData.nextAiringEpisode
          };
        }));
      const ans = result.filter(anime => (anime.status === 'RELEASING'))
      ans.sort(function(a, b){return a.next.airingAt - b.next.airingAt});
      await db.set("animes", ans);
      console.log("Updated")
      return "success"
    } catch (error) {
      // Handle any errors that may occur during database operations
      console.error("Error in updating:", error);
      throw error; // Re-throw the error for further handling
    }
    
  },
}

module.exports = animedb;