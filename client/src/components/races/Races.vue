<template>
  <div>
    <h1>Races</h1>
    <RaceStats v-bind:raceStats="races" v-bind:numRounds="numRounds"></RaceStats>
  </div>
</template>

<script>
const API_URL = "api/races";
// const API_URL =
// "https://cors-anywhere.herokuapp.com/https://dotacastlefight.com/api/races";
import RaceStats from "./RacesStats";

export default {
  data: () => ({
    error: "",
    races: [],
    numRounds: 0
  }),

  components: {
    RaceStats
  },

  mounted() {
    fetch(API_URL)
      .then(res => res.json())
      .then(races => {
        this.races = races.filter(race => race.race !== "Wisp");
      });
    fetch(`/api/games/records/num_player_rounds`)
      .then(res => res.json())
      .then(numRounds => {
        this.numRounds = parseInt(numRounds.count);
      });
  }
};
</script>

<style>
</style>