<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-btn text>Castle Fight</v-btn>
      </v-list-item>
      <v-divider></v-divider>
      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search for players..."
        prepend-inner-icon="mdi-magnify"
        class="mr-3"
        v-on:keyup.enter="searchPlayers"
      ></v-text-field>
      <v-list-item link to="/games">Games</v-list-item>
      <v-list-item link to="/races">Races</v-list-item>
      <v-list-item link to="/leaderboard">Leaderboard</v-list-item>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-btn text to="/" class="mr-5">
        <v-icon large color="red" left>mdi-chess-rook</v-icon>Castle Fight
      </v-btn>

      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search for players..."
        prepend-inner-icon="mdi-magnify"
        class="mr-3 d-none d-md-flex"
        v-on:keyup.enter="searchPlayers"
      ></v-text-field>

      <div class="flex-grow-1"></div>

      <v-toolbar-items class="d-none d-md-flex">
        <v-btn text to="/games">Games</v-btn>
        <v-btn text to="/races">Races</v-btn>
        <v-btn text to="/leaderboard">Leaderboard</v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: null
  }),

  methods: {
    searchPlayers: function(e) {
      const searchValue = e.target.value;
      this.$router.push({ path: "/search", query: { q: searchValue } });
    }
  }
};
</script>

<style>
</style>