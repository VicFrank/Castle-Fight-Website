<template>
  <div>
    <!-- Player Stats -->
    <v-card class="d-flex flex-row my-2 px-2">
      <span class="display-1 font-weight-bold my-auto mr-auto">{{playerInfo.username}}</span>
      <div class="d-none d-md-flex">
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
            <div class="header">{{playerInfo.num_rounds}}</div>
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
      </div>
    </v-card>
    <v-card class="d-flex flex-row my-2 px-2 d-md-none">
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
          <div class="header">{{playerInfo.num_rounds}}</div>
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
    <!-- Tabs -->
    <v-tabs fixed-tabs>
      <v-tab>Games</v-tab>
      <v-tab>Building Stats</v-tab>

      <!-- Game Content -->
      <v-tab-item>
        <div class="d-md-flex">
          <div class="order-last">
            <h2>Picks</h2>
            <RaceStats v-bind:raceStats="races" v-bind:numRounds="playerInfo.num_rounds | toNumber"></RaceStats>
          </div>
          <div class="games-list">
            <h2>Recent Games</h2>
            <PlayerGamesList v-bind:games="games" v-bind:showRaces="true"></PlayerGamesList>
          </div>
        </div>
      </v-tab-item>
      <!-- Building Stats Content -->
      <v-tab-item>
        <v-select :items="racesList" label="Race" solo v-on:change="onRaceSelected" dense></v-select>
        <BuildingStats
          v-bind:firstBuildings="firstBuildings"
          v-bind:allBuildings="allBuildings"
          v-bind:totalNumRounds="playerInfo.num_rounds | toNumber"
        ></BuildingStats>
      </v-tab-item>
    </v-tabs>
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
    racesList: [],
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
        this.racesList = races.map(race => race.race);
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

<style>
.header {
  color: white;
  font-size: 12px;
}

.sub-header {
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

h2 {
  padding: 5px;
}

.player-container {
  display: flex;
}

.mmr {
  line-height: 2.5rem;
  float: right;
}
</style>