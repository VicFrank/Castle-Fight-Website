<template>
  <v-tooltip left color="red darken-2">
    <template v-slot:activator="{ on }">
      <router-link :to="'/races/' + race">
        <img v-bind:src="getRaceImagePath(race)" v-bind:alt="race" v-on="on" />
      </router-link>
    </template>
    <span>{{race | capitalizeWords}}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    race: String
  },

  methods: {
    getRaceImagePath(race) {
      const parsedRace = race.toLowerCase().replace(/ /g, "_");
      return require(`../../assets/races/${parsedRace}_small.jpg`);
    }
  }
};
</script>

<style>
</style>