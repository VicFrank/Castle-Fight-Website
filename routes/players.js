const express = require("express");
const router = express.Router();
const games = require("../db/games");
const players = require("../db/players");
const apicache = require("apicache");
const redis = require("redis");

let cacheWithRedis = apicache.options({ redisClient: redis.createClient() })
  .middleware;

router.get("/", cacheWithRedis("1 week"), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const playersData = await players.getAllPlayers(limit, offset);
    res.status(200).json(playersData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid", cacheWithRedis("5 minutes"), async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.findPlayerBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/games", cacheWithRedis("5 minutes"), async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await games.findGamesBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/races", cacheWithRedis("5 minutes"), async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.getNumRacesPicked(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get(
  "/search/:username",
  cacheWithRedis("5 minutes"),
  async (req, res) => {
    try {
      const username = req.params.username;
      const rows = await players.searchPlayersByUsername(username);
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

router.get(
  "/:steamid/buildings",
  cacheWithRedis("5 minutes"),
  async (req, res) => {
    try {
      const steamid = req.params.steamid;
      const firstBuildings = await players.getFirstBuildingCounts(steamid);
      const allBuildings = await players.getBuildingCounts(steamid);
      const result = {
        firstBuildings: firstBuildings.map(stats => {
          return {
            ...stats,
            building: !stats.building ? "" : stats.building.slice(1, -1)
          };
        }),
        allBuildings: allBuildings.map(stats => {
          return {
            ...stats,
            building: !stats.building ? "" : stats.building.slice(1, -1)
          };
        })
      };
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

module.exports = router;
