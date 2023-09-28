const express = require("express");
const router = express.Router();
const players = require("../db/players");
const apicache = require("apicache");
const cache = apicache.middleware;

router.get("/", async (req, res) => {
  res.json({ info: "API for Castle Fight stats" });
});

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
