<template>
  <div>
    <h1>Races</h1>
    <RaceStats v-bind:raceStats="races"></RaceStats>
  </div>
</template>

<script>
const API_URL = "api/races";
// const API_URL =
// "https://cors-anywhere.herokuapp.com/https://dotacastlefight.com/api/races";
import RaceStats from "./RacesStats";

export default {
  name: "races",
  data: () => ({
    error: "",
    races: []
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
  },
  methods: {}
};
</script>

<style>
</style>