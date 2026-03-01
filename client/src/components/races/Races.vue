<template>
  <v-container>
    <h1>Races</h1>
    <v-select
      :items="timeSelects"
      label="This Month"
      solo
      dense
      v-on:change="onTimeFilterSelected"
      class="mt-2"
    ></v-select>
    <v-skeleton-loader v-if="loading" type="table" />
    <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>
    <RaceStats v-else :raceStats="races" :numRounds="numRounds"></RaceStats>
  </v-container>
</template>

<script>
import api from "../../api";
import RaceStats from "./RacesStats";

export default {
  data: () => ({
    error: null,
    loading: true,
    races: [],
    numRounds: 0,
    timeSelects: ["This Month", "This Week", "Past 24 Hours"],
  }),

  components: {
    RaceStats,
  },

  mounted() {
    this.getContent(this.getHoursForLabel("This Month"));
  },

  methods: {
    getContent(hours) {
      this.loading = true;
      this.error = null;
      Promise.all([api.getRaces(hours), api.getNumPlayerRounds(hours)])
        .then(([races, numRounds]) => {
          this.races = races.filter((r) => r.race !== "Wisp");
          this.numRounds = parseInt(numRounds.count);
        })
        .catch(() => {
          this.error = "Failed to load race data.";
        })
        .finally(() => {
          this.loading = false;
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
      this.getContent(this.getHoursForLabel(label));
    },
  },
};
</script>

<style></style>
