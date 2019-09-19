const { query } = require("./index");

/*
  Get detailed player stats:
    Overall winrate (game winrate, round winrate)
*/

module.exports = {
  async getAllPlayers(limit = 100, offset = 0) {
    try {
      console.log(limit, offset);
      const sql_query = `
        SELECT * FROM PLAYERS
        LIMIT $1 OFFSET $2
      `;
      const { rows } = await query(sql_query, [limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async findPlayerBySteamID(steamID) {
    try {
      const sql_query = `
      SELECT *
        FROM players
        WHERE steam_id = $1;
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async getLeaderboard(numPlayers = 100) {
    try {
      const sql_query = `
      SELECT mmr, username, steam_id
        FROM players
        ORDER BY mmr
        LIMIT $1
      `;
      const { rows } = await query(sql_query, [numPlayers]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getNumRacesPicked(steamID) {
    try {
      const sql_query = `
      SELECT race, count(*)
        FROM players
        JOIN round_players
        ON players.player_id = round_players.player_id
        WHERE players.steam_id = $1
        GROUP BY race
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getFirstBuildingCounts(steamID) {
    try {
      const sql_query = `
      SELECT build_order[1].building, count(*)
        FROM round_players
        JOIN players
        ON round_players.player_id = players.player_id
        WHERE players.steam_id = $1
        GROUP BY build_order[1].building
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getBuildingCounts(steamID) {
    try {
      const sql_query = `
      SELECT bo.building, count(*)
        FROM round_players
          JOIN players
          ON players.player_id = round_players.player_id,
          unnest(round_players.build_order) bo	
        WHERE players.steam_id = $1
        GROUP BY bo.building
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};
