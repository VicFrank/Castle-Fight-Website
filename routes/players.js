const express = require("express");
const router = express.Router();
const games = require("./db/games");

app.get("/players/:steamid", async (req, res) => {
  try {
    const steamid = parseInt(req.params.steamid);
    const playerInfo = await games.findPlayerBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
  }
});
app.get("/players/:steamid/games", async (req, res) => {
  try {
    const steamid = parseInt(req.params.steamid);
    const playerInfo = await games.findGamesBySteamID(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
