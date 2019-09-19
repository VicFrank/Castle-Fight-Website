const express = require("express");
const router = express.Router();
const games = require("../db/games");
const players = require("../db/players");

router.get("/player/:steamid", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.findPlayerBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/player/:steamid/games", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await games.findGamesBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/player/:steamid/races", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.getNumRacesPicked(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/player/:steamid/buildings", async (req, res) => {
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

router.get("/leaderboard", async (req, res) => {
  try {
    const numPlayers = parseInt(req.query.limit) || 100;
    const leaderboard = await players.getLeaderboard(numPlayers);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
