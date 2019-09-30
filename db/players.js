const { query } = require("./index");

module.exports = {
  async getAllPlayers(limit = 100, offset = 0) {
    try {
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
      WITH player AS
      (
      SELECT * FROM players
        WHERE steam_id = $1
      ),
      game_stats AS
      (
      SELECT 
        COUNT(DISTINCT(g.game_id)) as num_games,
        COUNT(DISTINCT (case when g.winning_team = rp.team then g.game_id end)) as game_wins,
        COUNT(DISTINCT(rp.game_id, rp.round_number)) as num_rounds,
        COUNT(DISTINCT (case when r.round_winner = rp.team then (rp.game_id, rp.round_number) end)) as round_wins
      FROM players as p
        JOIN round_players as rp
        ON p.player_id = rp.player_id
        JOIN games as g
        ON g.game_id = rp.game_id
        JOIN rounds as r
        ON (r.game_id, r.round_number) = (rp.game_id, rp.round_number)
        WHERE p.steam_id = $1
      )
      SELECT * FROM player, game_stats;
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
      SELECT build_order[1].building,
          count(*),
          COUNT(case when r.round_winner = rp.team then (rp.game_id, rp.round_number) end) as wins
        FROM round_players rp
        JOIN players p
        USING (player_id)
        JOIN rounds r
        USING (game_id, round_number)
        WHERE p.steam_id = $1
        GROUP BY build_order[1].building
        ORDER BY build_order[1].count DESC;
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
      SELECT bo.building,
        count(*),
        COUNT(DISTINCT(rp.game_id, rp.round_number)) as num_rounds,
        COUNT(DISTINCT(case when r.round_winner = rp.team then (rp.game_id, rp.round_number) end)) as wins,
        COUNT(DISTINCT(case when r.round_winner != rp.team then (rp.game_id, rp.round_number) end)) as losses
      FROM round_players rp
        JOIN players p
        USING (player_id)
        JOIN rounds r
        USING (game_id, round_number),
          unnest(rp.build_order) bo	
      WHERE p.steam_id = $1
      GROUP BY bo.building
      ORDER BY bo.count DESC;
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};
