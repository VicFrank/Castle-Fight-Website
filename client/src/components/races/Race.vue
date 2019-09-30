<template>
  <div>
    <h1>{{$route.params.race}}</h1>
    <img class="race-image" v-bind:src="imagePath" v-bind:alt="$route.params.race" />
    <BuildingStats v-bind:firstBuildings="firstBuildings" v-bind:allBuildings="allBuildings"></BuildingStats>
  </div>
</template>

<script>
import BuildingStats from "../buildings/BuildingStats";

export default {
  name: "race",
  data: () => ({
    error: "",
    allBuildings: [],
    firstBuildings: []
  }),
  components: {
    BuildingStats
  },

  mounted() {
    fetch(`/api/races/${this.$route.params.race}/all_buildings`)
      .then(res => res.json())
      .then(allBuildings => {
        this.allBuildings = allBuildings;
      });
    fetch(`/api/races/${this.$route.params.race}/first_buildings`)
      .then(res => res.json())
      .then(firstBuildings => {
        this.firstBuildings = firstBuildings;
      });
  },
  methods: {},
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

.race-image {
  display: block;
  margin: auto;
  padding: 0 0 16px 0;
}
</style>