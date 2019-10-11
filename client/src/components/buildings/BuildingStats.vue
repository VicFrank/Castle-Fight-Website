<template>
  <div>
    <h2>First Building</h2>
    <v-simple-table>
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

    <h2>All Buildings</h2>
    <v-simple-table>
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

.building-image {
  width: auto;
  height: 100%;
  max-height: 36px;
}
</style>