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
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <router-link :to="'/races/' + race.race">
                  <img v-bind:src="getRaceImagePath(race.race)" v-bind:alt="race.race" v-on="on" />
                </router-link>
              </template>
              <span>{{race.race | capitalizeWords}}</span>
            </v-tooltip>
          </td>
          <td>{{race.rounds}}</td>
          <td>{{race.percentage | percentage()}}</td>
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
    getRaceImagePath(race) {
      const parsedRace = race.toLowerCase().replace(/ /g, "_");
      return require(`../../assets/races/${parsedRace}_small.jpg`);
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
</style>