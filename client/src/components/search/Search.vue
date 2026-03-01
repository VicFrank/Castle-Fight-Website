<template>
  <v-container>
    <h1>Search: "{{ $route.query.q }}"</h1>
    <v-skeleton-loader v-if="loading" type="card, card, card" />
    <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>
    <div v-else-if="users.length === 0" class="text-center py-8">
      <v-icon size="60" color="grey">mdi-account-search</v-icon>
      <p class="subtitle-1 grey--text mt-3">
        No players found matching "{{ $route.query.q }}"
      </p>
    </div>
    <v-row v-else>
      <v-col
        v-for="user in users"
        :key="user.steam_id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="mx-auto" hover :to="'/players/' + user.steam_id">
          <v-card-title class="subtitle-1">
            <v-icon small class="mr-2">mdi-account</v-icon>
            {{ user.username }}
          </v-card-title>
          <v-card-subtitle>{{ user.games }} games played</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from "../../api";

export default {
  data: () => ({
    users: [],
    loading: true,
    error: null,
  }),
  methods: {
    getContent() {
      this.loading = true;
      this.error = null;
      api
        .searchPlayers(this.$route.query.q)
        .then((users) => {
          this.users = users;
        })
        .catch(() => {
          this.error = "Search failed.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getContent();
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.getContent();
  },
};
</script>

<style></style>
