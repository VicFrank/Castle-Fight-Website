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
      player_games AS (
        SELECT games.* from games
        JOIN game_players
        USING (game_id)
        JOIN players
        USING (player_id)
        WHERE players.steam_id = $1
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
        JOIN player_games as g
        ON g.game_id = rp.game_id
        JOIN rounds as r
        ON (r.game_id, r.round_number) = (rp.game_id, rp.round_number)
        WHERE p.steam_id = $1
          AND ranked = True
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
      WITH player_games AS (
        SELECT games.* from games
        JOIN game_players
        USING (game_id)
        JOIN players
        USING (player_id)
        WHERE players.steam_id = $1
      )
      SELECT 
        COUNT(DISTINCT(rp.game_id, rp.round_number)) as num_rounds
      FROM players as p
        JOIN round_players as rp
        ON p.player_id = rp.player_id
        JOIN player_games as g
        ON g.game_id = rp.game_id
        JOIN rounds as r
        ON (r.game_id, r.round_number) = (rp.game_id, rp.round_number)
        WHERE p.steam_id = $1
          AND race = $2
          AND ranked = True
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
        SELECT players.*, COUNT(game_players) AS games
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
      WITH player_games AS (
        SELECT games.* from games
        JOIN game_players
        USING (game_id)
        JOIN players
        USING (player_id)
        WHERE players.steam_id = $1
      ),
      race_wins AS
      (SELECT race, count(race)
        FROM rounds
        JOIN round_players
        USING (game_id, round_number)
        JOIN players
        USING (player_id)
        JOIN player_games
        USING (game_id)
        WHERE round_players.team = rounds.round_winner
          AND ranked = True
          AND players.steam_id = $1
        GROUP BY race
      ),
      total_rounds AS
      (
      (SELECT race, count(race)
        FROM round_players
        JOIN players
        USING (player_id)
        JOIN player_games
        USING (game_id)
        WHERE players.steam_id = $1
          AND ranked = True
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
      WITH player_games AS (
        SELECT games.* from games
        JOIN game_players
        USING (game_id)
        JOIN players
        USING (player_id)
        WHERE players.steam_id = $1
      )
      SELECT build_order[1].building,
        count(*),
        COUNT(case when r.round_winner = rp.team then (rp.game_id, rp.round_number) end) as wins
      FROM round_players rp
      JOIN players p
      USING (player_id)
      JOIN rounds r
      USING (game_id, round_number)
      JOIN player_games
      USING (game_id)
      WHERE p.steam_id = $1
        AND ranked = True
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
      WITH player_games AS (
        SELECT games.* from games
        JOIN game_players
        USING (game_id)
        JOIN players
        USING (player_id)
        WHERE players.steam_id = $1
      )
      SELECT bo.building,
        count(*),
        COUNT(DISTINCT(rp.game_id, rp.round_number)) as num_rounds,
        COUNT(DISTINCT(case when r.round_winner = rp.team then (rp.game_id, rp.round_number) end)) as wins,
        COUNT(DISTINCT(case when r.round_winner != rp.team then (rp.game_id, rp.round_number) end)) as losses
      FROM round_players rp
        JOIN players p
        USING (player_id)
        JOIN player_games
        USING (game_id)
        JOIN rounds r
        USING (game_id, round_number),
          unnest(rp.build_order) bo 
      WHERE p.steam_id = $1
        AND ranked = True
      GROUP BY bo.building
      ORDER BY bo.count DESC;
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
      WITH player_games AS (
        SELECT games.* from games
        JOIN game_players
        USING (game_id)
        JOIN players
        USING (player_id)
        WHERE players.steam_id = $1
      )
      SELECT build_order[1].building,
          count(*),
          COUNT(case when r.round_winner = rp.team then (rp.game_id, rp.round_number) end) as wins
        FROM round_players rp
        JOIN players p
        USING (player_id)
        JOIN rounds r
        USING (game_id, round_number)
        JOIN player_games
        USING (game_id)
        WHERE p.steam_id = $1
          AND rp.race = $2
          AND ranked = True
        GROUP BY build_order[1].building
        ORDER BY build_order[1].count DESC;
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
      WITH player_games AS (
        SELECT games.* from games
        JOIN game_players
        USING (game_id)
        JOIN players
        USING (player_id)
        WHERE players.steam_id = $1
      )
      SELECT bo.building,
        count(*),
        COUNT(DISTINCT(rp.game_id, rp.round_number)) as num_rounds,
        COUNT(DISTINCT(case when r.round_winner = rp.team then (rp.game_id, rp.round_number) end)) as wins,
        COUNT(DISTINCT(case when r.round_winner != rp.team then (rp.game_id, rp.round_number) end)) as losses
      FROM round_players rp
        JOIN players p
        USING (player_id)
        JOIN player_games
        USING (game_id)
        JOIN rounds r
        USING (game_id, round_number),
          unnest(rp.build_order) bo	
      WHERE p.steam_id = $1
        AND rp.race = $2
        AND ranked = True
      GROUP BY bo.building
      ORDER BY bo.count DESC;
      `;
      const { rows } = await query(sql_query, [steamID, race]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};
