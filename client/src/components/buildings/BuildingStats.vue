<template>
  <div>
    <v-tabs grow hide-slider>
      <v-tab>First Building</v-tab>
      <v-tab>All Buildings</v-tab>

      <v-tab-item>
        <v-data-table
          :headers="firstBuildingHeaders"
          :items="parseFirstBuildings"
          :hide-default-footer="true"
          :must-sort="true"
        >
          <template v-slot:item.building="{ item }">
            <BuildingLink v-bind:building="item.building"></BuildingLink>
          </template>
          <template v-slot:item.count="{ item }">
            {{item.count / totalNumRounds | percentage}}
            <PercentBar v-bind:width="item.count / totalNumRounds | percentage"></PercentBar>
          </template>
          <template v-slot:item.win_rate="{ item }">
            {{item.win_rate | percentage}}
            <PercentBar v-bind:width="item.win_rate | percentage"></PercentBar>
          </template>
        </v-data-table>
      </v-tab-item>
      <v-tab-item>
        <v-data-table
          :headers="allBuildingHeaders"
          :items="parseAllBuildings"
          :hide-default-footer="true"
          :items-per-page="30"
          :must-sort="true"
        >
          <template v-slot:item.building="{ item }">
            <BuildingLink v-bind:building="item.building"></BuildingLink>
          </template>
          <template v-slot:item.count="{ item }">{{item.count / totalNumRounds | round(1)}}</template>
          <template v-slot:item.num_rounds="{ item }">
            {{item.num_rounds / totalNumRounds | percentage(1)}}
            <PercentBar v-bind:width="item.num_rounds / totalNumRounds | percentage"></PercentBar>
          </template>
          <template v-slot:item.win_rate="{ item }">
            {{item.win_rate | percentage(1)}}
            <PercentBar v-bind:width="item.win_rate | percentage"></PercentBar>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import PercentBar from "../Utility/PercentBar";
import BuildingLink from "./BuildingLink";
export default {
  name: "building-stats",
  data: () => ({
    firstBuildingHeaders: [
      { text: "Building", value: "building" },
      { text: "Build Rate", value: "count", width: 300 },
      { text: "Win Rate", value: "win_rate", width: 300 }
    ],
    allBuildingHeaders: [
      { text: "Building", value: "building" },
      { text: "Avg Built", value: "count" },
      { text: "Build Rate", value: "num_rounds", width: 300 },
      { text: "Win Rate", value: "win_rate", width: 300 }
    ]
  }),

  props: {
    firstBuildings: Array,
    allBuildings: Array,
    totalNumRounds: Number
  },

  components: {
    PercentBar,
    BuildingLink
  },

  computed: {
    parseFirstBuildings() {
      let parsed = this.firstBuildings.slice();
      parsed.map(
        building => (building.win_rate = building.wins / building.count)
      );
      return parsed;
    },
    parseAllBuildings() {
      let parsed = this.allBuildings.slice();
      parsed.map(
        building => (building.win_rate = building.wins / building.num_rounds)
      );
      return parsed;
    }
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