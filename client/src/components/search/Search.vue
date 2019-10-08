<template>
  <div>
    <v-container class="pa-2" fluid>
      <v-row>
        <v-col v-for="user in users" :key="user.steam_id">
          <v-card width="300" class="mx-auto">
            <v-card-text>
              <router-link :to="'/players/' + user.steam_id">{{user.username}}</router-link>
              <div>Games: {{user.games}}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
const API_URL = "/api/players/search";

export default {
  data: () => ({
    users: []
  }),
  computed: {
    searchValue: function() {
      return this.$route.query.q;
    }
  },
  mounted() {
    fetch(`${API_URL}/${this.$route.query.q}`)
      .then(res => res.json())
      .then(users => {
        this.users = users;
      });
  }
};
</script>

<style>
</style>