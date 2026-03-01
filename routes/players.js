const express = require("express");
const router = express.Router();
const games = require("../db/games");
const players = require("../db/players");
const seasons = require("../db/seasons");
const apicache = require("apicache");
let cache = apicache.middleware;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

router.get("/", cache("1 week"), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const offset = parseInt(req.query.offset) || 0;
    const playersData = await players.getAllPlayers(limit, offset);
    res.status(200).json(playersData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid", cache("5 minutes"), async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.findPlayerBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/games", cache("5 minutes"), async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await games.findGamesBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/races", cache("5 minutes"), async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.getNumRacesPicked(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/races/:race", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const race = capitalize(req.params.race);
    const firstBuildings = await players.getFirstBuildingCountsByRace(
      steamid,
      race,
    );
    const allBuildings = await players.getBuildingCountsByRace(steamid, race);
    const numRounds = await players.getNumRoundsByRace(steamid, race);
    const result = {
      firstBuildings: firstBuildings.map((stats) => {
        return {
          ...stats,
          building: !stats.building ? "" : stats.building.slice(1, -1),
        };
      }),
      allBuildings: allBuildings.map((stats) => {
        return {
          ...stats,
          building: !stats.building ? "" : stats.building.slice(1, -1),
        };
      }),
      numRounds: numRounds.num_rounds,
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/search/:username", cache("5 minutes"), async (req, res) => {
  try {
    const username = req.params.username;
    const rows = await players.searchPlayersByUsername(username);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/buildings", cache("5 minutes"), async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const firstBuildings = await players.getFirstBuildingCounts(steamid);
    const allBuildings = await players.getBuildingCounts(steamid);
    const result = {
      firstBuildings: firstBuildings.map((stats) => {
        return {
          ...stats,
          building: !stats.building ? "" : stats.building.slice(1, -1),
        };
      }),
      allBuildings: allBuildings.map((stats) => {
        return {
          ...stats,
          building: !stats.building ? "" : stats.building.slice(1, -1),
        };
      }),
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/seasons", cache("1 hour"), async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const history = await seasons.getPlayerSeasonHistory(steamid);
    res.status(200).json(history);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
