const { query } = require("./index");

module.exports = {
  async getAllPlayers(limit = 100, offset = 0) {
    try {
      console.log(limit, offset);
      const sql_query = `
      SELECT p.player_id, steam_id, mmr, username, profile_picture, count(*) as games
        FROM players as p
        JOIN game_players as gp
        ON p.player_id = gp.player_id
        GROUP BY p.player_id
        ORDER BY games DESC
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
      WITH num_games AS
      (
        SELECT steam_id, mmr, username, profile_picture, count(*) as games
          FROM players as p
          JOIN game_players as gp
          ON p.player_id = gp.player_id
          WHERE p.steam_id = $1
          GROUP BY p.player_id
      ),
      num_wins AS
      (
        SELECT count(*) as wins
          FROM players as p
          JOIN round_players as rp
          ON p.player_id = rp.player_id
          JOIN games as g
          ON g.game_id = rp.game_id
          WHERE g.winning_team = rp.team
            AND p.steam_id = $1
          GROUP BY p.player_id
      )
      SELECT steam_id, mmr, username, profile_picture, games, wins FROM num_wins, num_games;
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
        ORDER BY mmr DESC
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
      WITH race_wins AS
      (SELECT race, count(race)
        FROM rounds
        JOIN round_players
        ON rounds.game_id = round_players.game_id
        JOIN players
        ON round_players.player_id = players.player_id
        WHERE round_players.team = rounds.round_winner
	   		AND players.steam_id = $1
        GROUP BY race
      ),
      total_rounds AS
      (
      (SELECT race, count(race)
        FROM rounds
        JOIN round_players
        ON rounds.game_id = round_players.game_id
        JOIN players
        ON round_players.player_id = players.player_id
        WHERE players.steam_id = $1
        GROUP BY race)
      )
      SELECT race_wins.race, race_wins.count AS wins, total_rounds.count AS rounds, ROUND(race_wins.count::NUMERIC / total_rounds.count::NUMERIC, 2) AS percentage
        FROM race_wins
        JOIN total_rounds
        ON race_wins.race = total_rounds.race
        ORDER BY rounds DESC;
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