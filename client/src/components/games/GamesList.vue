<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>Game</th>
            <th>Settings</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody class="caption">
          <tr v-for="game in games" :key="game.game_id">
            <td>
              <router-link :to="'/games/' + game.game_id"
                >#{{ game.game_id }}</router-link
              >
              <div class="caption grey--text">
                {{ game.created_at | dateFromNow }}
              </div>
            </td>
            <td>
              <div class="caption">
                {{ game.ranked ? "Ranked" : "Unranked"
                }}<span v-if="game.allow_bots"> · Bots</span
                ><span v-if="game.draft_mode">
                  · {{ game.draft_mode | draftMode }}</span
                >
              </div>
              <div class="caption grey--text">
                {{ game.west_players }}v{{ game.east_players }}
              </div>
            </td>
            <td>
              <v-chip
                v-if="game.winning_team && game.winning_team !== 4"
                x-small
                :color="
                  game.winning_team == 2 ? 'green darken-3' : 'red darken-3'
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
              <div class="caption grey--text mt-1">
                {{ getRoundResults(game) }}
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: "games_list",
  data: () => ({}),

  props: {
    games: Array,
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

<style></style>
