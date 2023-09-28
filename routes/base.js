const express = require("express");
const router = express.Router();
const players = require("../db/players");
const games = require("../db/games");
const test = require("../test");
const apicache = require("apicache");

router.get("/", async (req, res) => {
  // games.create(test.sampleGameData);
  res.json({ info: "API for Castle Fight stats" });
});

// router.get("/test", async (req, res) => {
//   try {
//     const gameID = games.create(test.sampleGameData);
//     res.json(gameID);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Server Error" });
//   }
// });

router.get("/leaderboard", cache("5 minutes"), async (req, res) => {
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
