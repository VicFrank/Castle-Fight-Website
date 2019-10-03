<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Game</th>
          <th>Settings</th>
          <th>Result</th>
          <th>Race</th>
        </tr>
      </thead>
      <tbody class="caption">
        <tr v-for="game in games" :key="game.game_id">
          <th>
            <router-link :to="'/games/' + game.game_id">{{game.game_id}}</router-link>
            <div class="subtextfont-weight-light">{{game.created_at | dateFromNow}}</div>
          </th>
          <th class="caption">
            <div v-if="game.ranked ">
              <span v-if="game.ranked">Ranked</span>
              <span v-else>Unranked</span>
              <span v-if="game.allow_bots">Bots</span>
            </div>
            <!-- {{game.west_players}}v{{game.east_players}} -->
          </th>
          <th>
            <div v-if="game.winning_team === game.team" class="west-color">Won Match</div>
            <div v-if="game.winning_team !== game.team" class="east-color">Lost Match</div>
            <div>{{getRoundResults(game)}}</div>
          </th>
          <th>
            <span v-for="(race, index) in game.races" :key="index">
              <RaceLink v-bind:race="race | trimBrackets"></RaceLink>
            </span>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
z
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
</style>