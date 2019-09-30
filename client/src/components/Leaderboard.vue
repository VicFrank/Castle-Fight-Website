<template>
  <div>
    <h1>Leaderboard</h1>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th class="player">Player</th>
          <th>MMR</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in leaderboard" :key="player.steam_id">
          <th class="rank">{{index + 1}}</th>
          <th class="player" v-bind:style="{width: playerWidth, maxWidth: playerWidth}">
            <router-link :to="'/players/' + player.steam_id">{{player.username}}</router-link>
          </th>
          <th class="mmr">{{player.mmr}}</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const API_URL = "api/leaderboard/";

export default {
  name: "leaderboard",
  data: () => ({
    error: "",
    leaderboard: []
  }),

  mounted() {
    fetch(API_URL)
      .then(res => res.json())
      .then(leaderboard => {
        this.leaderboard = leaderboard;
      });
  },
  methods: {},

  computed: {
    playerWidth() {
      if (this.$vuetify.breakpoint.xsOnly) return "200px";
      else return "360px";
    }
  }
};
</script>

<style scoped>
table {
  margin: "auto";
}

.rank {
  width: 80px;
}

.player {
  text-align: left;
  padding: 8px 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.mmr {
  width: 100px;
}
</style>
