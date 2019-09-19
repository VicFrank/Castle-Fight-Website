const express = require("express");
const router = express.Router();
const games = require("../db/games");

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const pastHours = parseInt(req.query.hours);
    if (pastHours) {
      const gameInfo = await games.findGamesInPastXHours(
        pastHours,
        limit,
        offset
      );
      res.status(200).json(gameInfo);
    } else {
      const gameInfo = await games.getGames(limit, offset);
      res.status(200).json(gameInfo);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { server_key, data } = req.body;
    // TODO: Authenticate the server key
    console.log(server_key);
    const parsedData = JSON.parse(data);
    const insertedGameID = await games.create(parsedData);
    res.status(201).send({ message: `Created game with ID ${insertedGameID}` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:gameid", async (req, res) => {
  try {
    const gameid = parseInt(req.params.gameid);
    const gameInfo = await games.findGameByID(gameid);
    res.status(200).json(gameInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:gameid/rounds", async (req, res) => {
  try {
    const gameid = parseInt(req.params.gameid);
    const gameInfo = await games.findRoundsByGameID(gameid);
    res.status(200).json(gameInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/first_building_counts", async (req, res) => {
  try {
    const gameInfo = await games.getFirstBuildingCounts();
    res.status(200).json(gameInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/all_building_counts", async (req, res) => {
  try {
    const gameInfo = await games.getBuildingCounts();
    res.status(200).json(gameInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
