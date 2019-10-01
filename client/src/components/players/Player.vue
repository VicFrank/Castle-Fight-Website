<template>
  <div>
    <div>
      <span class="display-1 font-weight-bold">{{playerInfo.username}}</span>
      <span class="mmr">MMR: {{playerInfo.mmr}}</span>
    </div>
    <div class="game-stats">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Wins</th>
            <th>Win Percent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Games</td>
            <td>{{playerInfo.game_wins}}</td>
            <td>{{(playerInfo.game_wins / playerInfo.num_games) | percentage(2)}}</td>
          </tr>
          <tr>
            <td>Rounds</td>
            <td>{{playerInfo.round_wins}}</td>
            <td>{{(playerInfo.round_wins / playerInfo.num_rounds) | percentage(2)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="player-container">
      <div class="games-list">
        <div class="title">Recent Games</div>

        <GamesList v-bind:games="games" v-bind:showRaces="true"></GamesList>
      </div>
      <div class="pick-stats">
        <div class="title">Picks</div>
        <RaceStats v-bind:raceStats="races"></RaceStats>
        <BuildingStats v-bind:firstBuildings="firstBuildings" v-bind:allBuildings="allBuildings"></BuildingStats>
      </div>
    </div>
  </div>
</template>

<script>
import RaceStats from "../races/RacesStats";
import BuildingStats from "../buildings/BuildingStats";
import GamesList from "../games/GamesList";

export default {
  name: "player",
  data: () => ({
    error: "",
    races: [],
    firstBuildings: [],
    allBuildings: [],
    games: [],
    playerInfo: {}
  }),
  components: {
    RaceStats,
    BuildingStats,
    GamesList
  },

  mounted() {
    fetch(`/api/players/${this.$route.params.steam_id}`)
      .then(res => res.json())
      .then(playerInfo => {
        this.playerInfo = playerInfo;
      });
    fetch(`/api/players/${this.$route.params.steam_id}/races`)
      .then(res => res.json())
      .then(races => {
        this.races = races;
      });
    fetch(`/api/players/${this.$route.params.steam_id}/games`)
      .then(res => res.json())
      .then(games => {
        this.games = games;
      });
    fetch(`/api/players/${this.$route.params.steam_id}/buildings`)
      .then(res => res.json())
      .then(buildings => {
        this.firstBuildings = buildings.firstBuildings;
        this.allBuildings = buildings.allBuildings;
      });
  },
  methods: {}
};
</script>

<style scoped>
td {
  text-align: center;
  min-width: 100px;
}

.player-container {
  display: inline-grid;
  grid-template-columns: repeat(2, 50%);
  align-items: first baseline;
}

.mmr {
  line-height: 2.5rem;
  float: right;
}
</style>