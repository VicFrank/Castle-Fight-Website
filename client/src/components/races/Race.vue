<template>
  <v-container>
    <h1>{{ $route.params.race }}</h1>
    <img class="race-header-image" :src="imagePath" :alt="$route.params.race" />
    <v-select
      :items="timeSelects"
      label="This Month"
      solo
      dense
      v-on:change="onTimeFilterSelected"
      class="mt-2"
    ></v-select>
    <v-skeleton-loader v-if="loading" type="card, table" />
    <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>
    <div v-else>
      <v-row justify="center" class="my-3 mt-n4">
        <v-col cols="auto">
          <v-card flat class="text-center pa-3">
            <div class="stat-value">
              {{ (raceStats.rounds / totalPlayerRounds) | percentage }}
            </div>
            <div class="stat-label">Pick Rate</div>
          </v-card>
        </v-col>
        <v-col cols="auto">
          <v-card flat class="text-center pa-3">
            <div class="stat-value">
              {{ raceStats.percentage | percentage }}
            </div>
            <div class="stat-label">Win Rate</div>
          </v-card>
        </v-col>
      </v-row>
      <BuildingStats
        :firstBuildings="firstBuildings"
        :allBuildings="allBuildings"
        :totalNumRounds="raceStats.rounds | toNumber"
      ></BuildingStats>
    </div>
  </v-container>
</template>

<script>
import api from "../../api";
import BuildingStats from "../buildings/BuildingStats";

export default {
  name: "race",
  data: () => ({
    error: null,
    loading: true,
    allBuildings: [],
    firstBuildings: [],
    raceStats: {},
    totalPlayerRounds: 0,
    timeSelects: ["This Month", "This Week", "Past 24 Hours"],
  }),
  components: {
    BuildingStats,
  },

  mounted() {
    this.getContent(24 * 31);
  },

  methods: {
    getContent(hours) {
      this.loading = true;
      this.error = null;
      const race = this.$route.params.race;
      Promise.all([
        api.getRaceAllBuildings(race, hours),
        api.getRaceFirstBuildings(race, hours),
        api.getRace(race, hours),
        api.getNumPlayerRounds(hours),
      ])
        .then(([allBuildings, firstBuildings, raceStats, totalRounds]) => {
          this.allBuildings = this.parseBuildings(allBuildings);
          this.firstBuildings = this.parseBuildings(firstBuildings);
          this.raceStats = raceStats[0] || {
            percentage: "0",
            rounds: "0",
            wins: "0",
          };
          this.totalPlayerRounds = parseInt(totalRounds.count);
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
    parseBuildings(buildings) {
      const maxCount = Math.max(...buildings.map((o) => o.wins));
      return buildings.filter((b) => b.wins > maxCount / 200 && b.building);
    },
  },
  computed: {
    imagePath() {
      const race = this.$route.params.race;
      const parsedRace = race.toLowerCase().replace(/ /g, "_");
      return require(`../../assets/races/${parsedRace}_full.png`);
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 7px;
  padding: 8px 0;
}

.stat-value {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.race-header-image {
  display: block;
  margin: auto;
  padding: 0 0 16px 0;
}
</style>
