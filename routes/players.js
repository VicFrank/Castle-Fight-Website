const express = require("express");
const router = express.Router();
const games = require("../db/games");
const players = require("../db/players");

router.get("/", async (req, res) => {
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

router.get("/:steamid", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.findPlayerBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/games", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await games.findGamesBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/races", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.getNumRacesPicked(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/buildings", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const firstBuildings = await players.getFirstBuildingCounts(steamid);
    const allBuildings = await players.getBuildingCounts(steamid);
    const result = {
      firstBuildings: firstBuildings,
      allBuildings: allBuildings
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
