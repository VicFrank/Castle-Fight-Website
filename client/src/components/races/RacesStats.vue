<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Race</th>
          <th>Rounds</th>
          <th>Win Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="race in raceStats" :key="race.race">
          <td>
            <RaceLink v-bind:race="race.race"></RaceLink>
          </td>
          <td>{{race.rounds / numRounds | percentage(1)}}</td>
          <td>{{race.percentage | percentage(1)}} <PercentBar v-bind:width="race.percentage | percentage"></PercentBar></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import RaceLink from "./RaceLink";
import PercentBar from "../Utility/PercentBar"

export default {
  name: "race-stats",

  props: {
    raceStats: Array
  },

  components: {
    PercentBar,
    RaceLink
  },

  data: () => ({
    numRounds: 0,
  }),

  mounted() {
    fetch(`/api/games/records/num_player_rounds`)
      .then(res => res.json())
      .then(numRounds => {
        this.numRounds = parseInt(numRounds.count);
      });
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