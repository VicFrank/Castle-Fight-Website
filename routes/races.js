const express = require("express");
const router = express.Router();
const games = require("../db/games");
const apicache = require("apicache");
let cache = apicache.middleware;

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

router.get("/", cache("1 day"), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours);
    const hours2 = parseInt(req.query.hours2) || 0;
    const rows = await games.getRaceCounts(hours, hours2);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:race", cache("1 day"), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours);
    const hours2 = parseInt(req.query.hours2) || 0;
    const race = req.params.race.capitalize();
    let rows = await games.getRaceStats(race, hours, hours2);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:race/all_buildings", cache("1 day"), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours);
    const hours2 = parseInt(req.query.hours2) || 0;
    const race = req.params.race.capitalize();
    let rows = await games.getRaceBuildingStats(race, hours, hours2);
    rows = rows.map((stats) => {
      return {
        ...stats,
        building: !stats.building ? "" : stats.building.slice(1, -1),
      };
    });
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:race/first_buildings", cache("1 day"), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours);
    const hours2 = parseInt(req.query.hours2) || 0;
    const race = req.params.race.capitalize();
    let rows = await games.getRaceFirstBuildingStats(race, hours, hours2);
    rows = rows.map((stats) => {
      return {
        ...stats,
        building: !stats.building ? "" : stats.building.slice(1, -1),
      };
    });
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
