<template>
  <div>
    <div class="title">First Building</div>
    <table>
      <thead>
        <tr>
          <th>Building</th>
          <th>Count</th>
          <th>Win Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="building in firstBuildings" :key="building.building">
          <td>
            <router-link :to="'/buildings/' + building.building">{{building.building}}</router-link>
          </td>
          <td>{{building.count}}</td>
          <td>{{(building.wins / building.count) | percentage(2)}}</td>
        </tr>
      </tbody>
    </table>
    <div class="title">All Buildings</div>
    <table>
      <thead>
        <tr>
          <th>Building</th>
          <th>Total Built</th>
          <th>Rounds Built</th>
          <th>Win Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="building in allBuildings" :key="building.building">
          <td>
            <router-link :to="'/buildings/' + building.building">{{building.building}}</router-link>
          </td>
          <td>{{building.count}}</td>
          <td>{{building.num_rounds}}</td>
          <td>{{(building.wins / building.num_rounds) | percentage(2)}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "building-stats",
  data: () => ({}),

  props: {
    firstBuildings: Array,
    allBuildings: Array
  },

  methods: {}
};
</script>

<style scoped>
td {
  min-width: 100px;
  text-align: center;
}
</style>