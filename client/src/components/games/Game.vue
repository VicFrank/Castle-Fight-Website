<template>
  <div>
    <div
      v-bind:class="{
        'west-color': gameInfo.winning_team == 2,
        'east-color': gameInfo.winning_team == 3,
      }"
      class="display-2 match-result"
      v-if="gameInfo.winning_team"
    >
      <template v-if="gameInfo.winning_team !== 4"
        >{{ gameInfo.winning_team | intToTeam }} Victory</template
      >
      <template v-else>Draw</template>
    </div>
    <div v-else-if="!loading" class="display-2 match-result">Unfinished</div>
    <div v-if="gameInfo.draft_mode" class="match-result">
      {{ gameInfo.draft_mode }}
    </div>
    <div class="headline match-result">{{ getRoundResults(gameInfo) }}</div>
    <div v-for="round in rounds" :key="round.round_number">
      <div class="round-result">
        Round {{ round.round_number }}:
        <span
          v-bind:class="{
            'west-color': round.round_winner == 2,
            'east-color': round.round_winner == 3,
          }"
          class="title"
        >
          <template v-if="round.round_winner !== 4"
            >{{ round.round_winner | intToTeam }} Victory</template
          >
          <template v-else>Draw</template>
        </span>
      </div>
      <div class="west-color team-header">Western Forces</div>
      <TeamScoreboard v-bind:players="round.players.west"></TeamScoreboard>
      <div class="east-color team-header">Eastern Forces</div>
      <TeamScoreboard v-bind:players="round.players.east"></TeamScoreboard>
    </div>
  </div>
</template>

<script>
import TeamScoreboard from "./TeamScoreboard";

const API_URL = "/api/games";
// const API_URL = "https://cors-anywhere.herokuapp.com/https://dotacastlefight.com/api/games"

export default {
  name: "game",
  data: () => ({
    error: "",
    rounds: [],
    gameInfo: {},
    loading: true,
  }),

  mounted() {
    fetch(`${API_URL}/${this.$route.params.game_id}/rounds`)
      .then((res) => res.json())
      .then((rounds) => {
        rounds.sort((a, b) => a.round_number - b.round_number);
        this.rounds = rounds;
      });
    fetch(`${API_URL}/${this.$route.params.game_id}`)
      .then((res) => res.json())
      .then((gameInfo) => {
        this.gameInfo = gameInfo;
        this.loading = false;
      });
  },

  components: {
    TeamScoreboard,
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
    },
  },
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