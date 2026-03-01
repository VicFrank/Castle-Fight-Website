<template>
  <div>
    <v-img
      src="../assets/preview_image.jpg"
      max-height="300"
      class="hidden-sm-and-down"
      gradient="to bottom, rgba(0,0,0,0), rgba(30,20,18,1)"
    ></v-img>

    <v-container>
      <v-row justify="center" class="mt-4 mb-6">
        <v-btn
          x-large
          color="red darken-3"
          href="https://steamcommunity.com/sharedfiles/filedetails/?id=1757281740"
          target="_blank"
        >
          <v-icon left>mdi-steam</v-icon>Play For Free
        </v-btn>
      </v-row>

      <v-row>
        <!-- Top Players -->
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="d-flex align-center mb-3">
              <v-icon color="amber" class="mr-2">mdi-trophy</v-icon>
              <span class="title">Top Players</span>
              <v-spacer></v-spacer>
              <v-btn text small to="/leaderboard" color="blue">View All</v-btn>
            </div>
            <v-skeleton-loader v-if="loading" type="table-tbody" />
            <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>
            <v-simple-table v-else dense>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>MMR</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(player, i) in topPlayers" :key="player.steam_id">
                  <td class="text-center">
                    <v-icon v-if="i === 0" small color="amber"
                      >mdi-trophy</v-icon
                    >
                    <v-icon v-else-if="i === 1" small color="grey lighten-1"
                      >mdi-trophy</v-icon
                    >
                    <v-icon v-else-if="i === 2" small color="brown lighten-1"
                      >mdi-trophy</v-icon
                    >
                    <span v-else class="caption grey--text">{{ i + 1 }}</span>
                  </td>
                  <td>
                    <router-link :to="'/players/' + player.steam_id">{{
                      player.username
                    }}</router-link>
                  </td>
                  <td>{{ player.mmr }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>

        <!-- Recent Games -->
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="d-flex align-center mb-3">
              <v-icon color="green" class="mr-2">mdi-sword-cross</v-icon>
              <span class="title">Recent Games</span>
              <v-spacer></v-spacer>
              <v-btn text small to="/games" color="blue">View All</v-btn>
            </div>
            <v-skeleton-loader v-if="loadingGames" type="table-tbody" />
            <v-alert v-else-if="gamesError" type="error" dense>{{
              gamesError
            }}</v-alert>
            <v-simple-table v-else dense>
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Time</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="game in recentGames" :key="game.game_id">
                  <td>
                    <router-link :to="'/games/' + game.game_id"
                      >#{{ game.game_id }}</router-link
                    >
                  </td>
                  <td class="caption">{{ game.created_at | dateFromNow }}</td>
                  <td>
                    <v-chip
                      v-if="game.winning_team && game.winning_team !== 4"
                      x-small
                      :color="
                        game.winning_team == 2
                          ? 'green darken-3'
                          : 'red darken-3'
                      "
                      text-color="white"
                      >{{ game.winning_team | intToTeam }}</v-chip
                    >
                    <v-chip
                      v-else-if="game.winning_team === 4"
                      x-small
                      color="grey darken-2"
                      >Draw</v-chip
                    >
                    <span v-else class="caption grey--text">—</span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import api from "../api";

export default {
  name: "home",
  data: () => ({
    topPlayers: [],
    recentGames: [],
    loading: true,
    loadingGames: true,
    error: null,
    gamesError: null,
  }),
  mounted() {
    api
      .getLeaderboard()
      .then((players) => {
        this.topPlayers = players.slice(0, 10);
      })
      .catch(() => {
        this.error = "Failed to load leaderboard.";
      })
      .finally(() => {
        this.loading = false;
      });

    api
      .getRecentGames()
      .then((games) => {
        this.recentGames = games
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10);
      })
      .catch(() => {
        this.gamesError = "Failed to load recent games.";
      })
      .finally(() => {
        this.loadingGames = false;
      });
  },
};
</script>

<style></style>
