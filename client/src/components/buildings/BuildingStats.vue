<template>
  <div>
    <div class="title">First Building</div>
    <table>
      <thead>
        <tr>
          <th>Building</th>
          <th>Built</th>
          <th>Win Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="building in firstBuildings" :key="building.building">
          <td>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <router-link :to="'/buildings/' + building.building">
                  <img
                    class="building-image"
                    v-bind:src="getBuildingImagePath(building.building)"
                    v-bind:alt="building.building"
                    v-on="on"
                  />
                </router-link>
              </template>
              <span>{{building.building | underscoreToSpace | capitalizeWords}}</span>
            </v-tooltip>
          </td>
          <td>{{building.count}}</td>
          <td>{{(building.wins / building.count) | percentage(1)}}</td>
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
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <router-link :to="'/buildings/' + building.building">
                  <img
                    class="building-image"
                    v-bind:src="getBuildingImagePath(building.building)"
                    v-bind:alt="building.building"
                    v-on="on"
                  />
                </router-link>
              </template>
              <span>{{building.building | underscoreToSpace | capitalizeWords}}</span>
            </v-tooltip>
          </td>
          <td>{{building.count}}</td>
          <td>{{building.num_rounds}}</td>
          <td>{{(building.wins / building.num_rounds) | percentage(1)}}</td>
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

  methods: {
    getBuildingImagePath(buildingName) {
      if (!buildingName) return null;
      return require(`../../assets/ability-icons/${buildingName}_small.png`);
    }
  }
};
</script>

<style scoped>
td {
  min-width: 100px;
  text-align: center;
}

.building-image {
  width: auto;
  height: 100%;
  max-height: 36px;
}
</style>