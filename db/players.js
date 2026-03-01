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
      WITH player AS (
        SELECT * FROM players WHERE steam_id = $1
      ),
      game_stats AS (
        SELECT
          COUNT(DISTINCT g.game_id) as num_games,
          COUNT(DISTINCT CASE WHEN g.winning_team = rp.team THEN g.game_id END) as game_wins,
          COUNT(DISTINCT (rp.game_id, rp.round_number)) as num_rounds,
          COUNT(DISTINCT CASE WHEN r.round_winner = rp.team THEN (rp.game_id, rp.round_number) END) as round_wins
        FROM player p
        JOIN round_players rp USING (player_id)
        JOIN games g ON g.game_id = rp.game_id
        JOIN rounds r ON (r.game_id, r.round_number) = (rp.game_id, rp.round_number)
        WHERE g.ranked = True
      )
      SELECT * FROM player, game_stats;
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async getNumRoundsByRace(steamID, race) {
    try {
      const sql_query = `
      SELECT
        COUNT(DISTINCT (rp.game_id, rp.round_number)) as num_rounds
      FROM round_players rp
      JOIN games g USING (game_id)
      JOIN rounds r ON (r.game_id, r.round_number) = (rp.game_id, rp.round_number)
      WHERE rp.player_id = (SELECT player_id FROM players WHERE steam_id = $1)
        AND rp.race = $2
        AND g.ranked = True
      `;
      const { rows } = await query(sql_query, [steamID, race]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async searchPlayersByUsername(username) {
    try {
      const sql_query = `
        SELECT players.*, COUNT(game_players.game_id) AS games
        FROM players LEFT JOIN game_players USING (player_id)
        WHERE username ILIKE '%' || $1 || '%'
        GROUP BY player_id
        ORDER BY games DESC;
      `;
      const { rows } = await query(sql_query, [username]);
      return rows;
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
      SELECT race,
        COUNT(*) FILTER (WHERE round_players.team = rounds.round_winner) AS wins,
        COUNT(*) AS rounds,
        ROUND(COUNT(*) FILTER (WHERE round_players.team = rounds.round_winner)::NUMERIC / COUNT(*)::NUMERIC, 2) AS percentage
      FROM round_players
      JOIN rounds USING (game_id, round_number)
      JOIN games USING (game_id)
      WHERE round_players.player_id = (SELECT player_id FROM players WHERE steam_id = $1)
        AND ranked = True
      GROUP BY race
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
        COUNT(case when r.round_winner = rp.team then 1 end) as wins
      FROM round_players rp
      JOIN rounds r USING (game_id, round_number)
      JOIN games USING (game_id)
      WHERE rp.player_id = (SELECT player_id FROM players WHERE steam_id = $1)
        AND ranked = True
      GROUP BY build_order[1].building
      ORDER BY count(*) DESC;
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
        COUNT(DISTINCT (rp.game_id, rp.round_number)) as num_rounds,
        COUNT(DISTINCT CASE WHEN r.round_winner = rp.team THEN (rp.game_id, rp.round_number) END) as wins,
        COUNT(DISTINCT CASE WHEN r.round_winner != rp.team THEN (rp.game_id, rp.round_number) END) as losses
      FROM round_players rp
      JOIN rounds r USING (game_id, round_number)
      JOIN games USING (game_id),
        unnest(rp.build_order) bo
      WHERE rp.player_id = (SELECT player_id FROM players WHERE steam_id = $1)
        AND ranked = True
      GROUP BY bo.building
      ORDER BY count(*) DESC;
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getFirstBuildingCountsByRace(steamID, race) {
    try {
      const sql_query = `
      SELECT build_order[1].building,
        count(*),
        COUNT(case when r.round_winner = rp.team then 1 end) as wins
      FROM round_players rp
      JOIN rounds r USING (game_id, round_number)
      JOIN games USING (game_id)
      WHERE rp.player_id = (SELECT player_id FROM players WHERE steam_id = $1)
        AND rp.race = $2
        AND ranked = True
      GROUP BY build_order[1].building
      ORDER BY count(*) DESC;
      `;
      const { rows } = await query(sql_query, [steamID, race]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getBuildingCountsByRace(steamID, race) {
    try {
      const sql_query = `
      SELECT bo.building,
        count(*),
        COUNT(DISTINCT (rp.game_id, rp.round_number)) as num_rounds,
        COUNT(DISTINCT CASE WHEN r.round_winner = rp.team THEN (rp.game_id, rp.round_number) END) as wins,
        COUNT(DISTINCT CASE WHEN r.round_winner != rp.team THEN (rp.game_id, rp.round_number) END) as losses
      FROM round_players rp
      JOIN rounds r USING (game_id, round_number)
      JOIN games USING (game_id),
        unnest(rp.build_order) bo
      WHERE rp.player_id = (SELECT player_id FROM players WHERE steam_id = $1)
        AND rp.race = $2
        AND ranked = True
      GROUP BY bo.building
      ORDER BY count(*) DESC;
      `;
      const { rows } = await query(sql_query, [steamID, race]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};
