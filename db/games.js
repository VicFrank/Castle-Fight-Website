const { query } = require("./index");
const { getEloRatingChange } = require("../utility/mmr");
const { parseBuildEvent } = require("./typeParser");

module.exports = {
  async create(gameData) {
    try {
      let playerIDtoPrimaryKey = {};
      let playerIDtoMMR = {};

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
            `INSERT INTO players(steam_id, username)
             values ($1, $2)
             on conflict(steam_id)
             do UPDATE SET username = $2
             RETURNING (player_id, mmr)`,
            [steamID, username]
          );

          const returnedRow = playerRows[0].row;
          const parsedRow = returnedRow.slice(1, -1).split(",");
          const playerPrimaryKey = parsedRow[0];
          const mmr = parseInt(parsedRow[1]);

          playerIDtoPrimaryKey[dotaPlayerID] = playerPrimaryKey;
          playerIDtoMMR[dotaPlayerID] = mmr;

          // Add the players to this game
          await query(
            "INSERT INTO game_players(game_id, player_id) values($1, $2)",
            [gameID, playerPrimaryKey]
          );
        }
      }

      for (let round of rounds) {
        const {
          roundNumber,
          winner: roundWinner,
          duration,
          playerStats
        } = round;
        // console.log(`Inserting round ${roundNumber}`);
        await query(
          `INSERT INTO rounds(game_id, round_number, round_winner, duration)
           values($1, $2, $3, $4)`,
          [gameID, roundNumber, roundWinner, duration]
        );

        let mmrData = {
          west: [],
          east: []
        };

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

          // this will be undefined if there is a bot, but if there is a bot
          // the game shouldn't be ranked, and we shouldn't be calculating
          // mmr anyway
          const mmr = playerIDtoMMR[playerID];

          // grab the stuff we need to calculate mmr
          if (team === 2) mmrData.west.push(mmr);
          else if (team === 3) mmrData.east.push(mmr);

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

        if (ranked && roundWinner < 4) {
          const westAverageMMR =
            mmrData.west.reduce((a, b) => a + b) / mmrData.west.length;
          const eastAverageMMR =
            mmrData.east.reduce((a, b) => a + b) / mmrData.east.length;
          let ratingChange;
          if (roundWinner == 2)
            ratingChange = getEloRatingChange(westAverageMMR, eastAverageMMR);
          else if (roundWinner == 3)
            ratingChange = getEloRatingChange(eastAverageMMR, westAverageMMR);
          else ratingChange = 0;

          if (ratingChange) {
            for (let roundPlayer of playerStats) {
              const { playerID, team } = roundPlayer;

              const mmr = playerIDtoMMR[playerID];
              const mmrChange =
                team == roundWinner ? ratingChange : -ratingChange;

              const playerPrimaryKey = playerIDtoPrimaryKey[playerID];

              if (mmr && mmrChange && playerPrimaryKey) {
                await query(
                  `UPDATE players
                  SET mmr = mmr + $1
                  WHERE player_id = $2`,
                  [mmrChange, playerPrimaryKey]
                );
              }
            }
          }
        }
      }

      return gameID;
    } catch (error) {
      throw error;
    }
  },
  async findGameByID(gameID) {
    try {
      const sql_query = `
      SELECT g.*,
        COUNT(DISTINCT case when round_winner = 2 then round_number end) as west_wins,
        COUNT(DISTINCT case when round_winner = 3 then round_number end) as east_wins,
        COUNT(DISTINCT case when round_winner = 4 then round_number end) as draws
        FROM games g 
        JOIN rounds r
        USING (game_id)
        WHERE g.game_id = $1
        GROUP BY g.game_id
      `;
      const { rows } = await query(sql_query, [gameID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async deleteGameByID(gameID) {
    try {
      const sql_query = `
        DELETE FROM game_players WHERE game_id = $1;
        DELETE FROM rounds WHERE game_id = $1;
        DELETE FROM round_players WHERE game_id = $1;
        DELETE FROM games WHERE game_id = $1;
      `;
      await query(sql_query, [gameID]);
      return true;
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
        `SELECT rp.*, username, steam_id
          FROM round_players rp
          LEFT JOIN players p
          USING (player_id)
          WHERE game_id = $1`,
        [gameID]
      );
      rows.map(row => {
        row.players = {};
        row.players.west = [];
        row.players.east = [];
      });
      // parse the build order list for each round player
      const parsedPlayerRows = playerRows.map(player => ({
        ...player,
        build_order: parseBuildEvent(player.build_order)
      }));
      for (let roundPlayer of parsedPlayerRows) {
        let roundNumber = roundPlayer.round_number;
        // insert into the result
        for (let row of rows) {
          if (row.round_number == roundNumber) {
            if (roundPlayer.team == 2) row.players.west.push(roundPlayer);
            else if (roundPlayer.team == 3) row.players.east.push(roundPlayer);
            break;
          }
        }
      }
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async findGamesBySteamID(steamID, limit = 100, offset = 0) {
    try {
      const sql_query = `
      SELECT g.*, 
        team,
        array_agg('['|| race || ']') as races,
        COUNT(DISTINCT case when round_winner = 2 then round_number end) as west_wins,
        COUNT(DISTINCT case when round_winner = 3 then round_number end) as east_wins,
        COUNT(DISTINCT case when round_winner = 4 then round_number end) as draws
        FROM round_players rp
        JOIN games g
        USING (game_id)
        JOIN rounds r
        USING (round_number, game_id)
        JOIN players p
        USING (player_id)
        WHERE steam_id = $1
        GROUP BY g.game_id, team
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3;
      `;
      const { rows } = await query(sql_query, [steamID, limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getNumPlayerRounds() {
    try {
      const sql_query = `
      SELECT count(*) FROM round_players;
      `;
      const { rows } = await query(sql_query);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async getFirstBuildingWinRates() {
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
      GROUP BY build_order[1].building
      ORDER BY build_order[1].count DESC;
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getBuildingWinRates() {
    try {
      const sql_query = `
      WITH building_counts AS
      (SELECT building, count(*) FROM
        (SELECT DISTINCT (game_id, round_number, team), bo.building
          FROM round_players,
          unnest(build_order) bo
          WHERE player_id IS NOT NULL
        ) t1
      GROUP BY building
      ),
      building_wins AS 
      (SELECT building, count(*) FROM
        (SELECT DISTINCT (round_players.game_id, round_players.round_number), bo.building
          FROM round_players
          JOIN rounds
          ON (round_players.game_id, round_players.round_number) = (rounds.game_id, rounds.round_number),
            unnest(round_players.build_order) bo
          WHERE round_players.player_id IS NOT NULL
            AND rounds.round_winner = round_players.team
        ) t2
        GROUP BY building
      ),
      total_counts AS
      (
        (SELECT building, count(*) FROM
        (SELECT bo.building
          FROM round_players,
            unnest(round_players.build_order) bo
          WHERE round_players.player_id IS NOT NULL
        ) t3
        GROUP BY building
      )
      )
      SELECT building_counts.building, building_wins.count as wins, building_counts.count as rounds,
      ROUND(building_wins.count::numeric / building_counts.count::numeric, 2) as percentage,
      total_counts.count as total_purchased
        FROM building_counts
        JOIN building_wins
        USING (building)
        JOIN total_counts
        USING (building)
        ORDER BY percentage DESC;
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getGames(limit = 100, offset = 0, hours) {
    try {
      let whereClause = "";
      if (hours) {
        whereClause = "WHERE created_at >= NOW() - $3 * INTERVAL '1 HOURS'";
      }
      const sql_query = `
      SELECT g.*, 
        array_agg('[' || round_number || ','|| race || ',' || team || ']') as races,
        COUNT(DISTINCT case when round_winner = 2 then round_number end) as west_wins,
        COUNT(DISTINCT case when round_winner = 3 then round_number end) as east_wins,
        COUNT(DISTINCT case when round_winner = 4 then round_number end) as draws,
        COUNT(DISTINCT case when team = 2 then player_id end) as west_players,
        COUNT(DISTINCT case when team = 3 then player_id end) as east_players
        FROM round_players rp
        JOIN games g
        USING (game_id)
        JOIN rounds r
        USING (round_number, game_id)
        ${whereClause}
        GROUP BY g.game_id
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2;
      `;
      let result;
      if (hours) {
        const { rows } = await query(sql_query, [limit, offset, hours]);
        result = rows;
      } else {
        const { rows } = await query(sql_query, [limit, offset]);
        result = rows;
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
  async getRaceCounts() {
    try {
      const sql_query = `
      WITH race_wins AS
      (SELECT race, count(race)
        FROM rounds
        JOIN round_players
        USING (game_id, round_number)
        WHERE round_players.team = rounds.round_winner
        GROUP BY race
      ),
      total_rounds AS
      (
      (SELECT race, count(race)
        FROM round_players
        GROUP BY race)
      )
      SELECT race_wins.race,
          race_wins.count AS wins,
          total_rounds.count AS rounds,
          ROUND(race_wins.count::NUMERIC / total_rounds.count::NUMERIC, 2) AS percentage
        FROM race_wins
        JOIN total_rounds
        ON race_wins.race = total_rounds.race
        ORDER BY percentage DESC;
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getRaceStats(race) {
    try {
      const sql_query = `
      WITH race_wins AS
      (SELECT race, count(race)
        FROM rounds
        JOIN round_players
        USING (game_id, round_number)
        WHERE round_players.team = rounds.round_winner
          AND race = $1
        GROUP BY race
      ),
      total_rounds AS
      (
      (SELECT race, count(race)
        FROM round_players
        WHERE race = $1
        GROUP BY race)
      )
      SELECT race_wins.race,
          race_wins.count AS wins,
          total_rounds.count AS rounds,
          ROUND(race_wins.count::NUMERIC / total_rounds.count::NUMERIC, 2) AS percentage
        FROM race_wins
        JOIN total_rounds
        ON race_wins.race = total_rounds.race;
      `;
      const { rows } = await query(sql_query, [race]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getRaceBuildingStats(race) {
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
      WHERE rp.race = $1
      GROUP BY bo.building
      ORDER BY bo.count DESC;
      `;
      const { rows } = await query(sql_query, [race]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getRaceFirstBuildingStats(race) {
    try {
      const sql_query = `
      WITH building_counts AS
      (SELECT building, count(*) FROM
        (SELECT DISTINCT (game_id, round_number, team), bo.building
          FROM round_players,
          unnest(build_order) bo
          WHERE player_id IS NOT NULL
            AND race = $1
        ) t1
      GROUP BY building
      ),
      building_wins AS 
      (SELECT building, count(*) FROM
        (SELECT DISTINCT (round_players.game_id, round_players.round_number), bo.building
          FROM round_players
          JOIN rounds
          ON (round_players.game_id, round_players.round_number) = (rounds.game_id, rounds.round_number),
            unnest(round_players.build_order) bo
          WHERE round_players.player_id IS NOT NULL
            AND rounds.round_winner = round_players.team
            AND race = $1
        ) t2
        GROUP BY building
      ),
      total_counts AS
      (
        (SELECT building, count(*) FROM
        (SELECT bo.building
          FROM round_players,
            unnest(round_players.build_order) bo
          WHERE round_players.player_id IS NOT NULL
            AND race = $1
        ) t3
        GROUP BY building
      )
      )
      SELECT building_counts.building, building_wins.count as wins, building_counts.count as rounds,
      ROUND(building_wins.count::numeric / building_counts.count::numeric, 2) as percentage,
      total_counts.count as total_purchased
        FROM building_counts
        JOIN building_wins
        USING (building)
        JOIN total_counts
        USING (building)
        ORDER BY rounds DESC;
      `;
      const { rows } = await query(sql_query, [race]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};
