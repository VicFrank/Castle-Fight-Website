<template>
  <div class="image-holder">
    <v-tooltip left color="red darken-2">
      <template v-slot:activator="{ on }">
        <router-link :to="'/buildings/' + building">
          <img
            class="building-image"
            v-bind:src="getbuildingImagePath(building)"
            v-bind:alt="building"
            v-on="on"
          />
          <div v-if="buildTime" class="timestamp">{{getMinuteTime(buildTime)}}</div>
        </router-link>
      </template>
      <span>{{building | underscoreToSpace | capitalizeWords}}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    building: String,
    buildTime: Number
  },

  methods: {
    getbuildingImagePath(building) {
      const parsedbuilding = building.toLowerCase().replace(/ /g, "_");
      return require(`../../assets/ability-icons/${parsedbuilding}_small.png`);
    },
    getMinuteTime(time) {
      const intTime = parseInt(time);
      const minuteTime = Math.floor(intTime / 60);
      return `${minuteTime}m`;
    }
  }
};
</script>

<style scoped>
.building-image {
  width: 48px;
  height: 48px;
}

.image-holder {
  position: relative;
  display: inline-block;
  margin-right: 2px;
  overflow: hidden;
}

.timestamp {
  position: absolute;
  padding: 2px;
  color: white;
  text-shadow: 1px 1px 1px #000;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 0.85em;
  bottom: 0;
  width: 48px;
  height: 16px;
  line-height: 10px;
  text-align: center;
}
</style>