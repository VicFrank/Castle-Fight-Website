<template>
  <div>
    <!-- Player Stats -->
    <v-card class="d-flex flex-row my-2 px-2">
      <span class="display-1 font-weight-bold my-auto mr-auto">{{playerInfo.username}}</span>
    </v-card>
    <v-card class="d-flex flex-row my-2 px-2">
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
      <v-tab>Picks</v-tab>
      <v-tab>Building Stats</v-tab>

      <!-- Game Content -->
      <v-tab-item>
        <RaceStats v-bind:raceStats="races" v-bind:numRounds="playerInfo.num_rounds | toNumber"></RaceStats>
      </v-tab-item>
      <v-tab-item>
        <PlayerGamesList v-bind:games="games" v-bind:showRaces="true"></PlayerGamesList>
      </v-tab-item>
      <!-- Building Stats Content -->
      <v-tab-item>
        <v-select :items="racesList" label="Race" solo v-on:change="onRaceSelected" dense></v-select>
        <BuildingStats
          v-bind:firstBuildings="firstBuildings"
          v-bind:allBuildings="allBuildings"
          v-bind:totalNumRounds="numRaceRounds | toNumber"
        ></BuildingStats>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import RaceStats from "../races/RacesStats";
import BuildingStats from "../buildings/BuildingStats";
import PlayerGamesList from "./PlayerGamesList";

const API_URL = "/api";
// const API_URL =
// "https://cors-anywhere.herokuapp.com/https://dotacastlefight.com/api";

export default {
  name: "player",
  data: () => ({
    error: "",
    races: [],
    racesList: [],
    firstBuildings: [],
    allBuildings: [],
    numRaceRounds: 0,
    games: [],
    playerInfo: {}
  }),
  components: {
    RaceStats,
    BuildingStats,
    PlayerGamesList
  },

  mounted() {
    fetch(`${API_URL}/players/${this.$route.params.steam_id}`)
      .then(res => res.json())
      .then(playerInfo => {
        this.playerInfo = playerInfo;
        this.numRaceRounds = playerInfo.num_rounds;
      });
    fetch(`${API_URL}/players/${this.$route.params.steam_id}/races`)
      .then(res => res.json())
      .then(races => {
        this.races = races;
        this.racesList = races.map(race => race.race);
      });
    fetch(`${API_URL}/players/${this.$route.params.steam_id}/games`)
      .then(res => res.json())
      .then(games => {
        this.games = games;
      });
    fetch(`${API_URL}/players/${this.$route.params.steam_id}/buildings`)
      .then(res => res.json())
      .then(buildings => {
        this.firstBuildings = buildings.firstBuildings;
        this.allBuildings = buildings.allBuildings;
      });
  },
  methods: {
    getRaceStats(race) {
      fetch(`${API_URL}/players/${this.$route.params.steam_id}/races/${race}`)
        .then(res => res.json())
        .then(buildings => {
          this.firstBuildings = buildings.firstBuildings;
          this.allBuildings = buildings.allBuildings;
          this.numRaceRounds = buildings.numRaceRounds;
        });
    },
    onRaceSelected(race) {
      this.getRaceStats(race);
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

.content {
  padding: 5px;
}

.mmr {
  line-height: 2.5rem;
  float: right;
}
</style>