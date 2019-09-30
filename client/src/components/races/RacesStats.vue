<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Race</th>
          <th>Rounds</th>
          <th>Win Rate*</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="race in raceStats" :key="race.race">
          <td>
            <router-link :to="'/races/' + race.race">
              <img class="race-image" v-bind:src="getImagePath(race.race)" v-bind:alt="race.race" />
            </router-link>
          </td>
          <td>{{race.rounds}}</td>
          <td>{{race.percentage}} | percentage</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "race-stats",
  data: () => ({}),

  props: {
    raceStats: Array
  },

  methods: {
    getImagePath(race) {
      const parsedRace = race.toLowerCase().replace(/ /g, "_");
      return require(`../../assets/races/${parsedRace}_full.png`);
    }
  },

  computed: {}
};
</script>

<style scoped>
td {
  min-width: 100px;
  text-align: center;
  padding: 0px 8px;
}

.race-image {
  width: 64px;
  height: 36px;
}
</style>