const express = require("express");
const router = express.Router();
const games = require("../db/games");
const apicache = require("apicache");
const redis = require("redis");

let cacheWithRedis = apicache.options({ redisClient: redis.createClient() })
  .middleware;

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

router.get("/", cacheWithRedis("1 day"), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours);
    const rows = await games.getRaceCounts(hours);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:race", cacheWithRedis("1 day"), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours);
    const race = req.params.race.capitalize();
    let rows = await games.getRaceStats(race, hours);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get(
  "/:race/all_buildings",
  cacheWithRedis("1 day"),
  async (req, res) => {
    try {
      const hours = parseInt(req.query.hours);
      const race = req.params.race.capitalize();
      let rows = await games.getRaceBuildingStats(race, hours);
      rows = rows.map(stats => {
        return {
          ...stats,
          building: !stats.building ? "" : stats.building.slice(1, -1)
        };
      });
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

router.get(
  "/:race/first_buildings",
  cacheWithRedis("1 day"),
  async (req, res) => {
    try {
      const hours = parseInt(req.query.hours);
      const race = req.params.race.capitalize();
      let rows = await games.getRaceFirstBuildingStats(race, hours);
      rows = rows.map(stats => {
        return {
          ...stats,
          building: !stats.building ? "" : stats.building.slice(1, -1)
        };
      });
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

module.exports = router;
