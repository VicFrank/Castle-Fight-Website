<template>
  <div>
    <h1>Recent Games</h1>
    <GamesList v-bind:games="games"></GamesList>
  </div>
</template>

<script>
const API_URL = "/api/games/";
// const API_URL =
// "https://cors-anywhere.herokuapp.com/https://dotacastlefight.com/api/games/";
import GamesList from "./GamesList";

export default {
  name: "games",
  data: () => ({
    error: "",
    games: [],
  }),

  components: {
    GamesList,
  },

  mounted() {
    fetch(API_URL)
      .then((res) => res.json())
      .then((games) => {
        this.games = games;
      });
  },
  methods: {
    getTeamColor(teamNumber) {
      switch (teamNumber) {
        case 2:
          return "green";
        case 3:
          return "red";
        default:
          return "white";
      }
    },
    getRoundResults(game) {
      const draws = game.draws;
      let results = "";
      switch (game.winning_team) {
        case 2:
          results = `${game.west_wins}-${game.east_wins}`;
          break;
        case 3:
          results = `${game.east_wins}-${game.west_wins}`;
          break;
        default:
          return "";
      }
      if (draws > 0) {
        results = `${results}-${draws}`;
      }
      return results;
    },
  },

  computed: {
    playerWidth() {
      if (this.$vuetify.breakpoint.xsOnly) return "200px";
      else return "360px";
    },
  },
};
</script>

<style>
</style>