<template>
  <div>
    <v-card class="d-flex flex-row my-2 px-2">
      <span class="display-1 font-weight-bold my-auto mr-auto">{{playerInfo.username}}</span>
      <v-card flat tile>
        <v-container>
          <div class="header">{{playerInfo.num_games}}</div>
          <div class="sub-header">Games</div>
        </v-container>
      </v-card>
      <v-card flat tile>
        <v-container>
          <div class="header">{{(playerInfo.game_wins / playerInfo.num_games) | percentage}}</div>
          <div class="sub-header">Win Rate</div>
        </v-container>
      </v-card>
      <v-card flat tile>
        <v-container>
          <div class="header">{{playerInfo.num_games}}</div>
          <div class="sub-header">Rounds</div>
        </v-container>
      </v-card>
      <v-card flat tile>
        <v-container>
          <div class="header">{{(playerInfo.round_wins / playerInfo.num_rounds) | percentage}}</div>
          <div class="sub-header">Win Rate</div>
        </v-container>
      </v-card>
      <v-card flat tile>
        <v-container>
          <div class="header">{{playerInfo.mmr}}</div>
          <div class="sub-header">mmr</div>
        </v-container>
      </v-card>
    </v-card>
    <div class="player-container">
      <div class="games-list">
        <h2>Recent Games</h2>
        <PlayerGamesList v-bind:games="games" v-bind:showRaces="true"></PlayerGamesList>
      </div>
      <div class="pick-stats">
        <h2>Picks</h2>
        <RaceStats v-bind:raceStats="races" v-bind:numRounds="playerInfo.num_rounds | toNumber"></RaceStats>
        <!-- <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">Race</v-btn>
          </template>

          <v-list>
            <v-list-item v-for="race in races" :key="race.race" v-on="onRaceSelected(race.race)">
              <v-list-item-title>{{ race.race }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>-->
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
  methods: {
    onRaceSelected(race) {
      console.log(race);
    }
  }
};
</script>

<style scoped>
.header {
  color: white;
  font-size: 12px;
}

.sub-header {
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.player-container {
  display: flex;
}

.games-list {
  margin-right: 10px;
}

.mmr {
  line-height: 2.5rem;
  float: right;
}
</style>