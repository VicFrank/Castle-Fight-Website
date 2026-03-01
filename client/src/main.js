import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import moment from "moment";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("./components/Home"),
  },
  {
    path: "/games",
    component: () => import("./components/games/Games"),
  },
  {
    path: "/games/:game_id",
    component: () => import("./components/games/Game"),
  },
  {
    path: "/races",
    component: () => import("./components/races/Races"),
  },
  {
    path: "/races/:race",
    component: () => import("./components/races/Race"),
  },
  {
    path: "/leaderboard",
    component: () => import("./components/Leaderboard"),
  },
  {
    path: "/players/:steam_id",
    component: () => import("./components/players/Player"),
  },
  {
    path: "/buildings/:building_name",
    component: () => import("./components/buildings/Building"),
  },
  {
    path: "/search",
    component: () => import("./components/search/Search"),
  },
  {
    path: "*",
    component: () => import("./components/NotFound"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

Vue.filter("dateFromNow", function (value) {
  if (value) {
    return moment(String(value)).fromNow();
  }
});

Vue.filter("intToTeam", function (value) {
  if (value == 2) {
    return "West";
  } else if (value == 3) {
    return "East";
  } else {
    return "";
  }
});

Vue.filter("trimBrackets", function (value) {
  if (value) return value.replace(/\[|\]/g, "");
});

Vue.filter("trimFirstAndLast", function (value) {
  if (value) return value.slice(1, -1);
});

Vue.filter("underscoreToSpace", function (value) {
  if (value) return value.replace(/_/g, " ");
});

Vue.filter("toNumber", function (value) {
  if (value) return parseInt(value);
});

Vue.filter("capitalizeWords", function (value) {
  if (value) {
    var lower = String(value).toLowerCase();
    return lower.replace(/(^| )(\w)/g, function (x) {
      return x.toUpperCase();
    });
  }
});

Vue.filter("round", function (value, decimals) {
  if (!value) {
    value = 0;
  }

  if (!decimals) {
    decimals = 0;
  }

  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return value;
});

Vue.filter("percentage", function (value, decimals) {
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

Vue.filter("draftMode", function (value) {
  switch (String(value)) {
    case "1":
      return "All Pick";
    case "2":
      return "Single Draft";
    case "3":
      return "All Random";
    default:
      return value;
  }
});

Vue.filter("seasonDate", function (value) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
