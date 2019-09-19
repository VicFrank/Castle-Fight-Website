const { Pool } = require("pg");
const types = require("pg").types;

// select typname, oid, typarray from pg_type where typname = '_build_event' order by oid
// this needs to be updated every time the schema changes
const build_event_oid = 25512;
const parseBuildEvent = val => {
  // parse string of form {"('Barracks',3)","('Stronghold',33)"}
  // into javascript array of objects of form
  // [{building: barracks, time: 3}, {building: Stronghold, time: 33}]
  if (!val) return val;
  if (val === "{}") return [];

  // strip out the quotes and brackets
  val = val.slice(1, -1);
  val = val.replace(/"/g, "");
  // split on every second comma
  const splitVal = val.match(/[^,]+,[^,]+/g);

  let result = [];

  for (let buildEvent of splitVal) {
    const trimmedBuildEvent = buildEvent.slice(1, -1);
    const splitBuildEvent = trimmedBuildEvent.split(",");
    const buildingName = splitBuildEvent[0].slice(1, -1);
    const buildTime = parseInt(splitBuildEvent[1]);
    result.push({ building: buildingName, buildTime: buildTime });
  }

  return result;
};
types.setTypeParser(build_event_oid, parseBuildEvent);

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "castlefight",
  password: "password",
  port: 5432
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params);
  }
};
