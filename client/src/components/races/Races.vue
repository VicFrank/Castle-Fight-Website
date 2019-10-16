<template>
  <div>
    <h1>Races</h1>
    <v-select :items="timeSelects" label="This Month" solo v-on:change="onTimeFilterSelected" dense></v-select>
    <RaceStats v-bind:raceStats="races" v-bind:numRounds="numRounds"></RaceStats>
  </div>
</template>

<script>
const API_URL = "/api";
// const API_URL =
// "https://cors-anywhere.herokuapp.com/https://dotacastlefight.com/api";
import RaceStats from "./RacesStats";

export default {
  data: () => ({
    error: "",
    races: [],
    numRounds: 0,
    timeSelects: ["This Month", "This Week", "Past 24 Hours"]
  }),

  components: {
    RaceStats
  },

  mounted() {
    this.getContent(this.getHoursForLabel("This Month"));
  },

  methods: {
    getContent(hours) {
      fetch(`${API_URL}/races?hours=${hours}`)
        .then(res => res.json())
        .then(races => {
          this.races = races.filter(race => race.race !== "Wisp");
        });
      fetch(`${API_URL}/games/records/num_player_rounds?hours=${hours}`)
        .then(res => res.json())
        .then(numRounds => {
          this.numRounds = parseInt(numRounds.count);
        });
    },
    getHoursForLabel(label) {
      switch (label) {
        case "This Month":
          return 24 * 31;
        case "This Week":
          return 24 * 7;
        case "Past 24 Hours":
          return 24;
      }
    },
    onTimeFilterSelected(label) {
      const hours = this.getHoursForLabel(label);
      this.getContent(hours);
    }
  }
};
</script>

<style>
</style>