<template>
  <v-container>
    <v-skeleton-loader v-if="loading" type="article, table, table" />
    <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>
    <div v-else>
      <div
        :class="{
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
      <div v-else class="display-2 match-result">Unfinished</div>
      <div v-if="gameInfo.draft_mode" class="match-result caption mt-1">
        {{ gameInfo.draft_mode | draftMode }}
      </div>
      <div class="headline match-result mb-4">
        {{ getRoundResults(gameInfo) }}
      </div>

      <v-card
        v-for="round in rounds"
        :key="round.round_number"
        class="mb-4 pa-2"
      >
        <div class="round-result">
          Round {{ round.round_number }}:
          <span
            :class="{
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
        <TeamScoreboard :players="round.players.west"></TeamScoreboard>
        <div class="east-color team-header mt-3">Eastern Forces</div>
        <TeamScoreboard :players="round.players.east"></TeamScoreboard>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import api from "../../api";
import TeamScoreboard from "./TeamScoreboard";

export default {
  name: "game",
  data: () => ({
    error: null,
    rounds: [],
    gameInfo: {},
    loading: true,
  }),

  mounted() {
    const gameId = this.$route.params.game_id;
    Promise.all([api.getGameRounds(gameId), api.getGame(gameId)])
      .then(([rounds, gameInfo]) => {
        rounds.sort((a, b) => a.round_number - b.round_number);
        this.rounds = rounds;
        this.gameInfo = gameInfo;
      })
      .catch(() => {
        this.error = "Failed to load game details.";
      })
      .finally(() => {
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
  },
};
</script>

<style scoped>
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

::v-deep td {
  text-align: center;
  vertical-align: middle;
  padding: 0 8px;
}

::v-deep .player-column {
  width: 250px;
  text-align: left !important;
}

::v-deep .race-column {
  width: 36px;
}

::v-deep .build-order-column a {
  vertical-align: middle;
  display: inline-block;
  line-height: 0;
}
</style>
