const express = require("express");
const path = require("path");
const serveStatic = require("serve-static");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");
const racesRouter = require("./routes/races");
const baseRouter = require("./routes/base");

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("short"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static(path.join(__dirname, "client/dist")));

app.use("/api", baseRouter);
app.use("/api/games", gamesRouter);
app.use("/api/players", playersRouter);
app.use("/api/races", racesRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/dist/index.html"));
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
