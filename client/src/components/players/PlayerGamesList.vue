<template>
  <div>
    <v-simple-table height="675px" class="games-list-table">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Game</th>
            <th>Settings</th>
            <th>Result</th>
            <th>Race</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in games" :key="game.game_id">
            <td class="game-column">
              <router-link :to="'/games/' + game.game_id">{{game.game_id}}</router-link>
              <div class="caption">{{game.created_at | dateFromNow}}</div>
            </td>
            <td class="caption settings-column">
              <div v-if="game.ranked ">
                <span v-if="game.ranked">Ranked</span>
                <span v-else>Unranked</span>
                <span v-if="game.allow_bots">Bots</span>
              </div>
              {{game.west_players}}v{{game.east_players}}
            </td>
            <td class="result-column caption">
              <div v-if="game.winning_team === game.team" class="west-color">Won Match</div>
              <div v-if="game.winning_team !== game.team" class="east-color">Lost Match</div>
              <div>{{getRoundResults(game)}}</div>
            </td>
            <td class="race-column">
              <span v-for="(race, index) in game.races" :key="index">
                <RaceLink v-bind:race="race | trimBrackets"></RaceLink>
              </span>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import RaceLink from "../races/RaceLink";

export default {
  data: () => ({}),

  props: {
    games: Array
  },
  components: {
    RaceLink
  },
  methods: {
    getRoundResults(game) {
      const draws = game.draws;
      let results = "";
      switch (game.team) {
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
    }
  }
};
</script>

<style scoped>
th {
  text-align: center !important;
}
</style>