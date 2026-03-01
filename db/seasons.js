const { query } = require("./index");

module.exports = {
  async getLastSeason() {
    const { rows } = await query(
      `SELECT * FROM seasons ORDER BY ended_at DESC LIMIT 1`,
    );
    return rows[0] || null;
  },

  async getNextSeasonNumber() {
    const { rows } = await query(
      `SELECT COALESCE(MAX(season_number), 0) + 1 AS next FROM seasons`,
    );
    return rows[0].next;
  },

  // Snapshot all players' MMR rankings and insert into season_placements,
  // then normalize each player's MMR to avg(current_mmr, 1000).
  // Returns the newly created season row.
  async runSeasonReset(startedAt) {
    const client = await require("./index").pool.connect();
    try {
      await client.query("BEGIN");

      const seasonNumber = (
        await client.query(
          `SELECT COALESCE(MAX(season_number), 0) + 1 AS next FROM seasons`,
        )
      ).rows[0].next;

      // Insert the season record
      const { rows: seasonRows } = await client.query(
        `INSERT INTO seasons (season_number, started_at, ended_at)
         VALUES ($1, $2, NOW())
         RETURNING *`,
        [seasonNumber, startedAt],
      );
      const season = seasonRows[0];

      // Snapshot every player's MMR with their rank (only players with at least 1 game)
      await client.query(
        `INSERT INTO season_placements (season_id, player_id, final_mmr, rank)
         SELECT
           $1 AS season_id,
           p.player_id,
           p.mmr AS final_mmr,
           RANK() OVER (ORDER BY p.mmr DESC) AS rank
         FROM players p
         WHERE EXISTS (
           SELECT 1 FROM game_players gp WHERE gp.player_id = p.player_id
         )`,
        [season.season_id],
      );

      // Normalize MMR: new_mmr = ROUND((current_mmr + 1000) / 2.0)
      await client.query(
        `UPDATE players
         SET mmr = ROUND((mmr + 1000) / 2.0)
         WHERE EXISTS (
           SELECT 1 FROM game_players gp WHERE gp.player_id = players.player_id
         )`,
      );

      await client.query("COMMIT");
      return season;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async getPlayerSeasonHistory(steamID) {
    const { rows } = await query(
      `SELECT
         s.season_number,
         s.started_at,
         s.ended_at,
         sp.final_mmr,
         sp.rank,
         (SELECT COUNT(*) FROM season_placements WHERE season_id = s.season_id) AS total_players
       FROM season_placements sp
       JOIN seasons s ON s.season_id = sp.season_id
       JOIN players p ON p.player_id = sp.player_id
       WHERE p.steam_id = $1
       ORDER BY s.season_number DESC`,
      [steamID],
    );
    return rows;
  },
};
