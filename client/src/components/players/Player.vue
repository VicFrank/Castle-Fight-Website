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
            <th>Amount</th>
            <th>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Games</td>
            <td>{{playerInfo.num_games}}</td>
            <td>{{(playerInfo.game_wins / playerInfo.num_games) | percentage}}</td>
          </tr>
          <tr>
            <td>Rounds</td>
            <td>{{playerInfo.num_rounds}}</td>
            <td>{{(playerInfo.round_wins / playerInfo.num_rounds) | percentage}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="player-container">
      <div class="games-list">
        <div class="title">Recent Games</div>

        <PlayerGamesList v-bind:games="games" v-bind:showRaces="true"></PlayerGamesList>
      </div>
      <div class="pick-stats">
        <div class="title">Picks</div>
        <RaceStats v-bind:raceStats="races" v-bind:numRounds="playerInfo.num_rounds | toNumber"></RaceStats>
        <BuildingStats
          v-bind:firstBuildings="firstBuildings"
          v-bind:allBuildings="allBuildings"
          v-bind:totalNumRounds="playerInfo.num_rounds | toNumber"
        ></BuildingStats>
      </div>
    </div>
  </div>
</template>

<script>
import RaceStats from "../races/RacesStats";
import BuildingStats from "../buildings/BuildingStats";
import PlayerGamesList from "./PlayerGamesList";

const API_URL = "/api/players/";
// const API_URL =
// "https://cors-anywhere.herokuapp.com/https://dotacastlefight.com/api/players/";

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
    PlayerGamesList
  },

  mounted() {
    fetch(`${API_URL}${this.$route.params.steam_id}`)
      .then(res => res.json())
      .then(playerInfo => {
        console.log(this.playerInfo);
        this.playerInfo = playerInfo;
      });
    fetch(`${API_URL}${this.$route.params.steam_id}/races`)
      .then(res => res.json())
      .then(races => {
        this.races = races;
      });
    fetch(`${API_URL}${this.$route.params.steam_id}/games`)
      .then(res => res.json())
      .then(games => {
        this.games = games;
      });
    fetch(`${API_URL}${this.$route.params.steam_id}/buildings`)
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