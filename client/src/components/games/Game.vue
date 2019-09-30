<template>
  <div>
    <div
      v-bind:class="{'west-color': gameInfo.winning_team == 2, 'east-color': gameInfo.winning_team == 3}"
      class="display-2 match-result"
    >{{gameInfo.winning_team | intToTeam}} Victory</div>
    <div class="headline match-result">{{getRoundResults(gameInfo)}}</div>
    <div v-for="round in rounds" :key="round.round_number">
      <div class="round-result">
        Round {{round.round_number}}:
        <span
          v-bind:class="{'west-color': round.round_winner == 2, 'east-color': round.round_winner == 3}"
          class="title"
        >{{round.round_winner | intToTeam}} Victory</span>
      </div>
      <div class="west-color team-header">Western Forces</div>
      <table class="body-2">
        <thead>
          <tr>
            <th>Race</th>
            <th>Player</th>
            <th>Income</th>
            <th>Buildings</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(player, index) in round.players.west" :key="index">
            <td class="race-column">
              <router-link :to="'/races/' + player.race">
                <img
                  class="race-image"
                  v-bind:src="getImagePath(player.race)"
                  v-bind:alt="player.race"
                />
              </router-link>
            </td>
            <td class="player-column">
              <template v-if="player.player_id">
                <router-link :to="'/players/' + player.steam_id">{{player.username}}</router-link>
              </template>
              <template v-else>Bot Player</template>
            </td>
            <td>{{player.income}}</td>
            <td class="build-order-column">
              <span
                v-for="(buildEvent, index) in player.build_order"
                :key="buildEvent.buildTime + index"
              >
                {{buildEvent.building}}
                <span v-if="index+1 < player.build_order.length">-</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="east-color team-header">Eastern Forces</div>
      <table class="body-2">
        <thead>
          <tr>
            <th>Race</th>
            <th>Player</th>
            <th>Income</th>
            <th>Buildings</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in round.players.east" :key="index">
            <td class="race-column">
              <router-link :to="'/races/' + player.race">
                <img
                  class="race-image"
                  v-bind:src="getImagePath(player.race)"
                  v-bind:alt="player.race"
                />
              </router-link>
            </td>
            <td class="player-column">
              <template v-if="player.player_id">
                <router-link :to="'/players/' + player.steam_id">{{player.username}}</router-link>
              </template>
              <template v-else>Bot Player</template>
            </td>
            <td>{{player.income}}</td>
            <td class="build-order-column">
              <span
                v-for="(buildEvent, index) in player.build_order"
                :key="buildEvent.buildTime + index"
              >
                {{buildEvent.building}}
                <span v-if="index+1 < player.build_order.length">-</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "game",
  data: () => ({
    error: "",
    rounds: [],
    gameInfo: {}
  }),

  mounted() {
    //https://cors-anywhere.herokuapp.com/https://dotacastlefight.com/api/games/${this.$route.params.game_id}/rounds
    fetch(`/api/games/${this.$route.params.game_id}/rounds`)
      .then(res => res.json())
      .then(rounds => {
        rounds.sort((a, b) => a.round_number - b.round_number);
        this.rounds = rounds;
      });
    fetch(`/api/games/${this.$route.params.game_id}`)
      .then(res => res.json())
      .then(gameInfo => {
        this.gameInfo = gameInfo;
      });
  },

  methods: {
    getRoundResults(game) {
      const draws = game.draws;
      let results = "";
      switch (game.winning_team) {
        case 2:
          results = `${game.west_wins}-${game.east_wins}`;
          break;
        case 3:
          results = `${game.east_wins}-${game.west_wins}`;
          break;
        default:
          return "";
      }
      if (draws > 0) {
        results = `${results}-${draws}`;
      }
      return results;
    },
    getImagePath(race) {
      const parsedRace = race.toLowerCase().replace(/ /g, "_");
      return require(`../../assets/races/${parsedRace}_full.png`);
    }
  }
};
</script>

<style>
.match-result {
  text-align: center;
  text-shadow: 1px 1px 5px black;
}

.round-result {
  text-align: center;
  text-shadow: 1px 1px 5px black;
  font-size: 22px;
  padding-top: 10px;
}

.team-header {
  text-shadow: 1px 1px 2px black;
  text-transform: uppercase;
  font-size: 16px;
  padding: 4px;
}

.build-order-column {
  max-width: 400px;
}

.race-image {
  width: 64px;
  height: 36px;
}

td {
  text-align: center;
  vertical-align: middle;
  padding: 0 8px;
}

a {
  vertical-align: middle;
  display: inline-block;
  line-height: 0;
}

.race-column {
  width: 36px;
}

.player-column {
  width: 250px;
  text-align: left;
}
</style>