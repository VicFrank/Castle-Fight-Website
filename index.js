const express = require("express");
const path = require("path");
const cron = require("node-cron");

const morgan = require("morgan");
const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");
const racesRouter = require("./routes/races");
const baseRouter = require("./routes/base");
const seasonReset = require("./utility/seasonReset");

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("short"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
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

  // Check on startup whether a season reset is overdue
  seasonReset
    .runIfNeeded()
    .catch((err) => console.error("[Season Reset] Startup check failed:", err));
});

// Check every night at midnight UTC whether a season reset is due.
// runIfNeeded() is idempotent — it only resets once per 6-month period.
cron.schedule(
  "0 0 * * *",
  () => {
    seasonReset
      .runIfNeeded()
      .catch((err) =>
        console.error("[Season Reset] Nightly check failed:", err),
      );
  },
  { timezone: "UTC" },
);
