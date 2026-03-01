<template>
  <v-container>
    <v-skeleton-loader v-if="loading" type="card, card, table" />
    <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>
    <div v-else>
      <!-- Player Name -->
      <v-card class="my-2 px-4 py-3">
        <span class="display-1 font-weight-bold">{{
          playerInfo.username
        }}</span>
      </v-card>

      <!-- Stat Cards - responsive wrapping -->
      <v-row dense class="my-2">
        <v-col cols="6" sm="4" md v-for="stat in stats" :key="stat.label">
          <v-card class="text-center pa-3" flat>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabs -->
      <v-tabs v-model="activeTab" grow class="mt-2">
        <v-tab>Games</v-tab>
        <v-tab>Picks</v-tab>
        <v-tab>Building Stats</v-tab>
        <v-tab>Season History</v-tab>

        <!-- Game Content -->
        <v-tab-item>
          <v-alert v-if="errors.games" type="warning" dense class="mt-2">{{
            errors.games
          }}</v-alert>
          <PlayerGamesList
            v-else
            :games="games"
            :showRaces="true"
          ></PlayerGamesList>
        </v-tab-item>
        <v-tab-item>
          <v-alert v-if="errors.races" type="warning" dense class="mt-2">{{
            errors.races
          }}</v-alert>
          <RaceStats
            v-else
            :raceStats="races"
            :numRounds="playerInfo.num_rounds | toNumber"
          ></RaceStats>
        </v-tab-item>
        <!-- Building Stats Content -->
        <v-tab-item>
          <v-alert v-if="errors.buildings" type="warning" dense class="mt-2">{{
            errors.buildings
          }}</v-alert>
          <div v-else>
            <v-select
              :items="racesList"
              label="Race"
              solo
              dense
              v-on:change="onRaceSelected"
              class="mt-3"
            ></v-select>
            <BuildingStats
              :firstBuildings="firstBuildings"
              :allBuildings="allBuildings"
              :totalNumRounds="numRaceRounds | toNumber"
            ></BuildingStats>
          </div>
        </v-tab-item>
        <!-- Season History Content -->
        <v-tab-item>
          <v-card flat class="mt-2">
            <v-alert v-if="errors.seasons" type="warning" dense>{{
              errors.seasons
            }}</v-alert>
            <div
              v-else-if="seasonHistory.length === 0"
              class="text-center py-8"
            >
              <v-icon size="48" color="grey">mdi-calendar-blank</v-icon>
              <p class="subtitle-1 grey--text mt-2">No season history yet.</p>
            </div>
            <v-simple-table v-else dark>
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Period</th>
                  <th>Final MMR</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in seasonHistory" :key="s.season_number">
                  <td>{{ s.season_number }}</td>
                  <td>
                    {{ s.started_at | seasonDate }} –
                    {{ s.ended_at | seasonDate }}
                  </td>
                  <td>{{ s.final_mmr }}</td>
                  <td>#{{ s.rank }} / {{ s.total_players }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>
  </v-container>
</template>

<script>
import api from "../../api";
import RaceStats from "../races/RacesStats";
import BuildingStats from "../buildings/BuildingStats";
import PlayerGamesList from "./PlayerGamesList";

export default {
  name: "player",
  data: () => ({
    error: null,
    errors: {
      games: null,
      races: null,
      buildings: null,
      seasons: null,
    },
    loading: true,
    activeTab: 0,
    races: [],
    racesList: [],
    firstBuildings: [],
    allBuildings: [],
    numRaceRounds: 0,
    games: [],
    playerInfo: {},
    seasonHistory: [],
  }),
  components: {
    RaceStats,
    BuildingStats,
    PlayerGamesList,
  },

  computed: {
    stats() {
      const p = this.playerInfo;
      if (!p.num_games) return [];
      return [
        { label: "Games", value: p.num_games },
        {
          label: "Win Rate",
          value: this.$options.filters.percentage(p.game_wins / p.num_games),
        },
        { label: "Rounds", value: p.num_rounds },
        {
          label: "Round WR",
          value: this.$options.filters.percentage(p.round_wins / p.num_rounds),
        },
        { label: "MMR", value: p.mmr },
      ];
    },
  },

  mounted() {
    const id = this.$route.params.steam_id;

    // Player info is the critical request — controls the main loading state
    api
      .getPlayer(id)
      .then((playerInfo) => {
        this.playerInfo = playerInfo;
        this.numRaceRounds = playerInfo.num_rounds;
      })
      .catch(() => {
        this.error = "Failed to load player profile.";
      })
      .finally(() => {
        this.loading = false;
      });

    // These requests load independently — failures show per-tab warnings
    api
      .getPlayerRaces(id)
      .then((races) => {
        this.races = races;
        this.racesList = races.map((r) => r.race);
      })
      .catch(() => {
        this.errors.races = "Failed to load race data.";
      });

    api
      .getPlayerGames(id)
      .then((games) => {
        this.games = games;
      })
      .catch(() => {
        this.errors.games = "Failed to load games.";
      });

    api
      .getPlayerBuildings(id)
      .then((buildings) => {
        this.firstBuildings = buildings.firstBuildings;
        this.allBuildings = buildings.allBuildings;
      })
      .catch(() => {
        this.errors.buildings = "Failed to load building stats.";
      });

    api
      .getPlayerSeasons(id)
      .then((seasons) => {
        this.seasonHistory = seasons;
      })
      .catch(() => {
        this.errors.seasons = "Failed to load season history.";
      });
  },

  methods: {
    onRaceSelected(race) {
      api
        .getPlayerRaceBuildings(this.$route.params.steam_id, race)
        .then((buildings) => {
          this.firstBuildings = buildings.firstBuildings;
          this.allBuildings = buildings.allBuildings;
          this.numRaceRounds = buildings.numRounds;
        });
    },
  },
};
</script>

<style scoped>
.stat-value {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

h2 {
  padding: 5px;
}

.mmr {
  line-height: 2.5rem;
  float: right;
}
</style>
