const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");

const app = express();
const port = 3000;

app.use(morgan("short"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (request, response) => {
  response.json({ info: "API for Castle Fight stats" });
});

app.use("/games", gamesRouter);
app.use("/players", playersRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
