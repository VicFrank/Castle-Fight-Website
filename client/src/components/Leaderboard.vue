<template>
  <v-container>
    <h1>Leaderboard</h1>
    <v-skeleton-loader v-if="loading" type="table" />
    <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>
    <v-card v-else outlined>
      <v-simple-table>
        <thead>
          <tr>
            <th class="rank">Rank</th>
            <th class="player">Player</th>
            <th class="mmr-col">MMR</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in leaderboard" :key="player.steam_id">
            <td class="rank">
              <v-icon v-if="index === 0" small color="amber">mdi-trophy</v-icon>
              <v-icon v-else-if="index === 1" small color="grey lighten-1"
                >mdi-trophy</v-icon
              >
              <v-icon v-else-if="index === 2" small color="brown lighten-1"
                >mdi-trophy</v-icon
              >
              <span v-else>{{ index + 1 }}</span>
            </td>
            <td class="player" :style="{ maxWidth: playerWidth }">
              <router-link :to="'/players/' + player.steam_id">{{
                player.username
              }}</router-link>
            </td>
            <td class="mmr-col">{{ player.mmr }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
import api from "../api";

export default {
  name: "leaderboard",
  data: () => ({
    error: null,
    loading: true,
    leaderboard: [],
  }),

  mounted() {
    api
      .getLeaderboard()
      .then((leaderboard) => {
        this.leaderboard = leaderboard;
      })
      .catch(() => {
        this.error = "Failed to load leaderboard.";
      })
      .finally(() => {
        this.loading = false;
      });
  },

  computed: {
    playerWidth() {
      if (this.$vuetify.breakpoint.xsOnly) return "200px";
      else return "360px";
    },
  },
};
</script>

<style scoped>
.rank {
  width: 60px;
  text-align: center;
}

.player {
  text-align: left;
  padding: 8px 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.mmr-col {
  width: 100px;
}
</style>
