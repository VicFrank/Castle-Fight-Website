import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import moment from "moment";

import Home from "./components/Home";
import Games from "./components/games/Games";
import Game from "./components/games/Game";
import Races from "./components/races/Races";
import Race from "./components/races/Race";
import Player from "./components/players/Player";
import Leaderboard from "./components/Leaderboard";
import Building from "./components/buildings/Building";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/games",
    component: Games
  },
  {
    path: "/games/:game_id",
    component: Game
  },
  {
    path: "/races",
    component: Races
  },
  {
    path: "/races/:race",
    component: Race
  },
  {
    path: "/leaderboard",
    component: Leaderboard
  },
  {
    path: "/players/:steam_id",
    component: Player
  },
  {
    path: "/buildings/:building_name",
    component: Building
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

Vue.filter("dateFromNow", function(value) {
  if (value) {
    return moment(String(value)).fromNow();
  }
});

Vue.filter("intToTeam", function(value) {
  if (value == 2) {
    return "West";
  } else if (value == 3) {
    return "East";
  } else {
    return "";
  }
});

Vue.filter("trimBrackets", function(value) {
  if (value) return value.replace(/\s|\[|\]/g, "");
});

Vue.filter("trimFirstAndLast", function(value) {
  if (value) return value.slice(1, -1);
});

Vue.filter("round", function(value, decimals) {
  if (!value) {
    value = 0;
  }

  if (!decimals) {
    decimals = 0;
  }

  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return value;
});

Vue.filter("percentage", function(value, decimals) {
  if (!value) {
    value = 0;
  }

  if (!decimals) {
    decimals = 0;
  }

  value = value * 100;
  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  value = value + "%";
  return value;
});

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount("#app");
