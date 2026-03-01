const seasons = require("../db/seasons");

// Returns the most recent expected reset date (either June 1 or December 1)
// as a Date object, relative to the given date (defaults to now).
function getExpectedResetDate(now = new Date()) {
  const year = now.getFullYear();
  const june1 = new Date(Date.UTC(year, 5, 1)); // June 1
  const dec1 = new Date(Date.UTC(year, 11, 1)); // December 1

  if (now >= dec1) return dec1;
  if (now >= june1) return june1;
  // Before June 1 — last expected reset was Dec 1 of previous year
  return new Date(Date.UTC(year - 1, 11, 1));
}

// Returns the Date that represents the start of the season that began after
// the given expected reset date (i.e. the previous expected reset before it).
function getPreviousExpectedResetDate(resetDate) {
  const year = resetDate.getUTCFullYear();
  const month = resetDate.getUTCMonth(); // 5 = June, 11 = December

  if (month === 11) {
    // Dec 1 → previous was June 1 of same year
    return new Date(Date.UTC(year, 5, 1));
  } else {
    // June 1 → previous was Dec 1 of prior year
    return new Date(Date.UTC(year - 1, 11, 1));
  }
}

// Check whether a reset is needed for the current period and run it if so.
async function runIfNeeded() {
  const now = new Date();
  const expectedDate = getExpectedResetDate(now);
  const lastSeason = await seasons.getLastSeason();

  if (lastSeason && new Date(lastSeason.ended_at) >= expectedDate) {
    console.log(
      `[Season Reset] Already ran for this period (last reset: ${lastSeason.ended_at}). Skipping.`,
    );
    return null;
  }

  const startedAt = lastSeason
    ? new Date(lastSeason.ended_at)
    : getPreviousExpectedResetDate(expectedDate);

  console.log(
    `[Season Reset] Running season reset for period ending ${expectedDate.toISOString()}...`,
  );
  const season = await seasons.runSeasonReset(startedAt);
  console.log(
    `[Season Reset] Season ${season.season_number} recorded. Reset complete.`,
  );
  return season;
}

module.exports = { runIfNeeded, getExpectedResetDate };
