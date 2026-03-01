<template>
  <v-container>
    <h1>Recent Games</h1>
    <v-skeleton-loader v-if="loading" type="table" />
    <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>
    <div v-else>
      <GamesList :games="paginatedGames"></GamesList>
      <div class="text-center mt-2" v-if="totalPages > 1">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="7"
        ></v-pagination>
      </div>
    </div>
  </v-container>
</template>

<script>
import api from "../../api";
import GamesList from "./GamesList";

export default {
  name: "games",
  data: () => ({
    error: null,
    loading: true,
    games: [],
    page: 1,
    itemsPerPage: 25,
  }),

  components: {
    GamesList,
  },

  mounted() {
    api
      .getRecentGames()
      .then((games) => {
        this.games = games
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      })
      .catch(() => {
        this.error = "Failed to load games.";
      })
      .finally(() => {
        this.loading = false;
      });
  },

  computed: {
    totalPages() {
      return Math.ceil(this.games.length / this.itemsPerPage);
    },
    paginatedGames() {
      const start = (this.page - 1) * this.itemsPerPage;
      return this.games.slice(start, start + this.itemsPerPage);
    },
  },
};
</script>

<style></style>
