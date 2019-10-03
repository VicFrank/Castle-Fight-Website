<template>
  <div>
    <h1>{{$route.params.race}}</h1>
    <img class="race-header-image" v-bind:src="imagePath" v-bind:alt="$route.params.race" />
    <p>Pick Rate: {{raceStats.rounds / totalPlayerRounds | percentage}}</p>
    <p>Win Rate: {{raceStats.percentage | percentage}}</p>
    <BuildingStats
      v-bind:firstBuildings="firstBuildings"
      v-bind:allBuildings="allBuildings"
      v-bind:totalNumRounds="raceStats.rounds"
    ></BuildingStats>
  </div>
</template>

<script>
import BuildingStats from "../buildings/BuildingStats";

const API_URL = "/api/races";
// const API_URL =
  // "https://cors-anywhere.herokuapp.com/https://dotacastlefight.com/api/races";

export default {
  name: "race",
  data: () => ({
    error: "",
    allBuildings: [],
    firstBuildings: [],
    raceStats: [],
    totalPlayerRounds: 0
  }),
  components: {
    BuildingStats
  },

  mounted() {
    fetch(`${API_URL}/${this.$route.params.race}/all_buildings`)
      .then(res => res.json())
      .then(allBuildings => {
        this.allBuildings = this.parseBuildings(allBuildings);
      });
    fetch(`${API_URL}/${this.$route.params.race}/first_buildings`)
      .then(res => res.json())
      .then(firstBuildings => {
        this.firstBuildings = this.parseBuildings(firstBuildings);
      });
    fetch(`${API_URL}/${this.$route.params.race}`)
      .then(res => res.json())
      .then(raceStats => {
        this.raceStats = raceStats;
      });
    fetch(`/api/games/records/num_player_rounds`)
      .then(res => res.json())
      .then(totalPlayerRounds => {
        this.totalPlayerRounds = parseInt(totalPlayerRounds.count);
      });
  },
  methods: {
    parseBuildings(buildings) {
      const maxCount = Math.max.apply(
        Math,
        buildings.map(function(o) {
          return o.count;
        })
      );

      const filteredBuildings = buildings.filter(
        building => building.count > maxCount / 200 && building.building
      );
      return filteredBuildings;
    }
  },
  computed: {
    imagePath() {
      const race = this.$route.params.race;
      const parsedRace = race.toLowerCase().replace(/ /g, "_");
      return require(`../../assets/races/${parsedRace}_full.png`);
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 7px;
  padding: 8px 0;
}

.race-header-image {
  display: block;
  margin: auto;
  padding: 0 0 16px 0;
}
</style>