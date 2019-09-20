const { query } = require("./index");

module.exports = {
  async create(gameData) {
    try {
      let playerIDtoPrimaryKey = {};

      const { playerInfo, settings, winner, ranked, rounds } = gameData;
      const { roundsToWin, allowBots, cheatsEnabled } = settings;

      // Insert the game into the table
      const { rows: gameRows } = await query(
        `INSERT INTO games (winning_team, ranked, rounds_to_win, allow_bots, cheats_enabled)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING game_id`,
        [winner, ranked, roundsToWin, allowBots, cheatsEnabled]
      );

      // console.log(gameRows);
      const gameID = gameRows[0].game_id;

      // Insert the players into the database, if they are not already
      for (let playerData of playerInfo) {
        const { playerID: dotaPlayerID, steamID, username } = playerData;
        if (steamID !== null) {
          // console.log(`Inserting player with steamID: ${steamID}`);
          const { rows: playerRows } = await query(
            "INSERT INTO players(steam_id, username) values ($1, $2) on conflict(steam_id) do UPDATE SET username = $2 RETURNING (player_id, mmr)",
            [steamID, username]
          );

          const returnedRow = playerRows[0].row;
          const parsedRow = returnedRow.slice(1, -1).split(",");
          const playerPrimaryKey = parsedRow[0];
          const mmr = parsedRow[1];

          playerIDtoPrimaryKey[dotaPlayerID] = playerPrimaryKey;

          // Add the players to this game
          await query(
            "INSERT INTO game_players(game_id, player_id) values($1, $2)",
            [gameID, playerPrimaryKey]
          );
        }
      }

      for (let round of rounds) {
        const { roundNumber, winner, duration, playerStats } = round;
        // console.log(`Inserting round ${roundNumber}`);
        await query(
          `INSERT INTO rounds(game_id, round_number, round_winner, duration)
           values($1, $2, $3, $4)`,
          [gameID, roundNumber, winner, duration]
        );

        for (let roundPlayer of playerStats) {
          const {
            playerID,
            race,
            team,
            unitsSpawned,
            unitsKilled,
            abandoned,
            income,
            buildOrder
          } = roundPlayer;

          const playerPrimaryKey = playerIDtoPrimaryKey[playerID];

          // parse the build order into an array of rows for postgres
          const buildOrderRows = buildOrder.map(
            buildEvent => `('${buildEvent.building}', ${buildEvent.buildTime})`
          );

          // console.log(
          //   `Inserting round_player with playerID: ${playerID}, playerP round number ${roundNumber}`
          // );
          await query(
            `INSERT INTO round_players(game_id, player_id, round_number, race, team, units_spawned, units_killed, abandoned, income, build_order)
             values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              gameID,
              playerPrimaryKey,
              roundNumber,
              race,
              team,
              unitsSpawned,
              unitsKilled,
              abandoned,
              income,
              buildOrderRows
            ]
          );
        }

        return gameID;
      }
    } catch (error) {
      throw error;
    }
  },
  async findGameByID(gameID) {
    try {
      const sql_query = `
      SELECT *
        FROM games
        WHERE game_id = $1
      `;
      const { rows } = await query(sql_query, [gameID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async findRoundsByGameID(gameID) {
    try {
      const { rows } = await query(
        `SELECT *
          FROM rounds
          WHERE game_id = $1`,
        [gameID]
      );
      const { rows: playerRows } = await query(
        `SELECT *
          FROM round_players
          WHERE game_id = $1`,
        [gameID]
      );
      const result = {
        ...rows[0],
        players: playerRows
      };
      return result;
    } catch (error) {
      throw error;
    }
  },
  async findGamesBySteamID(steamID, limit = 100, offset = 0) {
    try {
      const sql_query = `
      SELECT games.*
        FROM games
        JOIN game_players
        ON game_players.game_id = games.game_id
        JOIN players
        ON players.player_id = game_players.player_id
        WHERE players.steam_id = $1
        LIMIT $2 OFFSET $3;
      `;
      const { rows } = await query(sql_query, [steamID, limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getFirstBuildingCounts() {
    try {
      const sql_query = `
      WITH building_counts AS
      (SELECT build_order[1].building, count(*)
        FROM round_players
        WHERE round_players.player_id IS NOT NULL
        GROUP BY build_order[1].building
      ),
      building_wins AS 
      (SELECT build_order[1].building, count(*)
        FROM round_players
        JOIN games
        ON round_players.game_id = games.game_id
        WHERE round_players.player_id IS NOT NULL
        AND games.winning_team = round_players.team
        GROUP BY build_order[1].building
      )
      SELECT building_counts.building, building_wins.count as wins, building_counts.count as games,
      ROUND(building_wins.count::numeric / building_counts.count::numeric, 2) as percentage FROM building_counts
        JOIN building_wins
        ON building_counts.building = building_wins.building
        ORDER BY percentage DESC;
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getBuildingCounts() {
    try {
      const sql_query = `
      WITH building_counts AS
      (SELECT bo.building, count(*)
        FROM round_players,
        unnest(round_players.build_order) bo
        WHERE round_players.player_id IS NOT NULL
        GROUP BY bo.building
      ),
      building_wins AS 
      (SELECT bo.building, count(*)
        FROM round_players
        JOIN games
        ON round_players.game_id = games.game_id,
          unnest(round_players.build_order) bo
        WHERE round_players.player_id IS NOT NULL
          AND games.winning_team = round_players.team
        GROUP BY bo.building
      )
      SELECT building_counts.building, building_wins.count as wins, building_counts.count as games,
      ROUND(building_wins.count::numeric / building_counts.count::numeric, 2) as percentage FROM building_counts
        JOIN building_wins
        ON building_counts.building = building_wins.building
        ORDER BY percentage DESC;
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getGames(limit = 100, offset = 0) {
    try {
      const sql_query = `
        SELECT * FROM GAMES ORDER BY created_at
        LIMIT $1 OFFSET $2
      `;
      const { rows } = await query(sql_query, [limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getRaceCounts() {
    try {
      const sql_query = `
      WITH race_wins AS
      (SELECT race, count(race)
        FROM games
        JOIN round_players
        ON games.game_id = round_players.game_id
        WHERE round_players.team = games.winning_team
        GROUP BY race
      ),
      total_games AS
      (
      (SELECT race, count(race)
        FROM games
        JOIN round_players
        ON games.game_id = round_players.game_id
        GROUP BY race)
      )
      SELECT race_wins.race, race_wins.count AS wins, total_games.count AS games, ROUND(race_wins.count::NUMERIC / total_games.count::NUMERIC, 2) AS percentage
        FROM race_wins
        JOIN total_games
        ON race_wins.race = total_games.race
        ORDER BY percentage DESC;
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async findGamesInPastXHours(hours, limit = 100, offset = 0) {
    try {
      console.log(hours);
      const sql_query = `
        SELECT * FROM GAMES
        WHERE created_at >= NOW() - $1 * INTERVAL '1 HOURS'
        ORDER BY created_at
        LIMIT $2 OFFSET $3
      `;
      const { rows } = await query(sql_query, [hours, limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};
