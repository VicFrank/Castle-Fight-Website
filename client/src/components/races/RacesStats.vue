<template>
  <v-data-table
    :headers="headers"
    :items="raceStats"
    :hide-default-footer="true"
    :must-sort="true"
    items-per-page="12"
  >
    <template v-slot:item.race="{ item }">
      <RaceLink v-bind:race="item.race"></RaceLink>
    </template>
    <template v-slot:item.rounds="{ item }">
      {{ (item.rounds / numRounds) | percentage(1) }}
      <PercentBar
        :max="maxRounds"
        :value="item.rounds | toNumber"
        v-bind:percent="(item.rounds / numRounds) | percentage(1)"
      ></PercentBar>
    </template>
    <template v-slot:item.percentage="{ item }">
      {{ item.percentage | percentage(1) }}
      <PercentBar
        :max="maxWinPercent"
        :value="item.percentage"
        v-bind:percent="item.percentage | percentage"
      ></PercentBar>
    </template>
  </v-data-table>
</template>

<script>
import RaceLink from "./RaceLink";
import PercentBar from "../Utility/PercentBar";

export default {
  data: () => ({
    headers: [
      { text: "Race", value: "race" },
      { text: "Pick Rate", value: "rounds", width: 300 },
      { text: "Win Rate", value: "percentage", width: 300 },
    ],
  }),

  computed: {
    minRounds: function () {
      if (this.raceStats.length < 1) return null;
      return this.getMinArray(this.raceStats, "rounds");
    },
    maxRounds: function () {
      if (this.raceStats.length < 1) return null;
      return this.getMaxArray(this.raceStats, "rounds");
    },
    minWinPercent: function () {
      if (this.raceStats.length < 1) return null;
      return this.getMinArray(this.raceStats, "percentage");
    },
    maxWinPercent: function () {
      if (this.raceStats.length < 1) return null;
      return this.getMaxArray(this.raceStats, "percentage");
    },
    columnWidth() {
      if (this.$vuetify.breakpoint.xsOnly) return 100;
      else return 300;
    },
  },

  props: {
    raceStats: Array,
    numRounds: Number,
  },

  components: {
    PercentBar,
    RaceLink,
  },

  methods: {
    getMinArray(arr, property) {
      return arr.reduce(
        (min, b) => Math.min(min, b[property]),
        arr[0][property]
      );
    },
    getMaxArray(arr, property) {
      return arr.reduce(
        (max, b) => Math.max(max, b[property]),
        arr[0][property]
      );
    },
  },
};
</script>

<style scoped>
</style>