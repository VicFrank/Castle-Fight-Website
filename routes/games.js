const express = require("express");
const router = express.Router();
const games = require("./db/games");

router.get("/:gameid", async (req, res) => {
  try {
    const gameid = parseInt(req.params.gameid);
    const gameInfo = await games.findGameByID(gameid);
    res.status(200).json(gameInfo);
  } catch (error) {
    console.log(error);
  }
});

router.post("/games", async (req, res) => {
  try {
    const { server_key, data } = req.body;
    // TODO: Authenticate the server key
    const parsedData = JSON.parse(data);
    const insertedGameID = await games.create(parsedData);
    res.status(201).send({ message: `Created game with ID ${insertedGameID}` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
