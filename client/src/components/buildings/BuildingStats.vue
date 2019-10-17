<template>
  <div>
    <v-tabs fixed-tabs>
      <v-tab>First Building</v-tab>
      <v-tab>All Buildings</v-tab>
      <v-tab-item>
        <v-simple-table class="stats-table">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Building</th>
                <th>Build Rate</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="building in firstBuildings" :key="building.building">
                <td>
                  <BuildingLink v-bind:building="building.building"></BuildingLink>
                </td>
                <td>
                  {{building.count / totalNumRounds | percentage}}
                  <PercentBar v-bind:width="building.count / totalNumRounds | percentage"></PercentBar>
                </td>
                <td>
                  {{building.wins / building.count | percentage(1)}}
                  <PercentBar v-bind:width="building.wins / building.count | percentage"></PercentBar>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
      <v-tab-item>
        <v-simple-table class="stats-table">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Building</th>
                <th>Average Built</th>
                <th>Build Rate</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="building in allBuildings" :key="building.building">
                <td>
                  <BuildingLink v-bind:building="building.building"></BuildingLink>
                </td>
                <td>{{building.count / totalNumRounds | round(1)}}</td>
                <td>
                  {{building.num_rounds / totalNumRounds | percentage(1)}}
                  <PercentBar v-bind:width="building.num_rounds / totalNumRounds | percentage"></PercentBar>
                </td>
                <td>
                  {{building.wins / building.num_rounds | percentage(1)}}
                  <PercentBar v-bind:width="building.wins / building.num_rounds | percentage"></PercentBar>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import PercentBar from "../Utility/PercentBar";
import BuildingLink from "./BuildingLink";
export default {
  name: "building-stats",
  data: () => ({}),

  props: {
    firstBuildings: Array,
    allBuildings: Array,
    totalNumRounds: Number
  },

  components: {
    PercentBar,
    BuildingLink
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

.stats-table {
  min-width: 410px;
}

.building-image {
  width: auto;
  height: 100%;
  max-height: 36px;
}
</style>