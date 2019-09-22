const express = require("express");
const router = express.Router();
const games = require("../db/games");
const keys = require("../config/keys");

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

    const dedicatedServerKey = process.env.IS_PRODUCTION
      ? keys.dedicatedServerKey
      : keys.toolsKey;

    if (server_key != dedicatedServerKey) {
      res.status(403).send({ message: `You are not authorized to add data` });
      return;
    }
    const parsedData = JSON.parse(data);
    const insertedGameID = await games.create(parsedData);
    res.status(201).send({ message: `Created game with ID ${insertedGameID}` });
  } catch (error) {
    console.log(data);
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

router.get("/records/first_buildings", async (req, res) => {
  try {
    const gameInfo = await games.getFirstBuildingCounts();
    res.status(200).json(gameInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/records/all_buildings", async (req, res) => {
  try {
    const gameInfo = await games.getBuildingCounts();
    res.status(200).json(gameInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/records/races", async (req, res) => {
  try {
    const rows = await games.getRaceCounts();
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
