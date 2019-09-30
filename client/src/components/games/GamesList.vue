<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Game</th>
          <th>Settings</th>
          <th>Result</th>
          <th v-if="showRaces">Race</th>
        </tr>
      </thead>
      <tbody class="caption">
        <tr v-for="game in games" :key="game.game_id">
          <th>
            <router-link :to="'/games/' + game.game_id">{{game.game_id}}</router-link>
            <div class="subtextfont-weight-light">{{game.created_at | dateFromNow}}</div>
          </th>
          <th class="caption">
            <div v-if="game.ranked">Ranked</div>
            <span v-if="game.allow_bots">Bots Allowed</span>
            {{game.west_players}}v{{game.east_players}}
          </th>
          <th>
            <div
              v-bind:class="{'west-color': game.winning_team == 2, 'east-color': game.winning_team == 3}"
            >{{game.winning_team | intToTeam}} Victory</div>
            <div>{{getRoundResults(game)}}</div>
          </th>
          <th v-if="showRaces">
            <span v-for="(race, index) in game.races" :key="index">
              {{race | trimBrackets}}
              <span v-if="index+1 < game.races.length">-</span>
            </span>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "games",
  data: () => ({}),

  props: {
    games: Array,
    showRaces: Boolean
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
    }
  }
};
</script>

<style>
</style>