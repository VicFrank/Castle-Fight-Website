<template>
  <div>
    <v-simple-table class="games-list-table" dense style="width: auto">
      <template v-slot:default>
        <colgroup>
          <col style="width: 120px" />
          <col style="width: 110px" />
          <col style="width: 100px" />
          <col style="width: 1px; white-space: nowrap" />
        </colgroup>
        <thead>
          <tr>
            <th>Game</th>
            <th>Settings</th>
            <th>Result</th>
            <th>Race</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="game in games.slice(
              itemsPerPage * (page - 1),
              itemsPerPage * page,
            )"
            :key="game.game_id"
          >
            <td>
              <router-link :to="'/games/' + game.game_id">{{
                game.game_id
              }}</router-link>
              <div class="caption">{{ game.created_at | dateFromNow }}</div>
            </td>
            <td>
              <div>
                <span>{{ game.ranked ? "Ranked" : "Unranked" }}</span>
                <span v-if="game.allow_bots"> · Bots</span>
                <span v-if="game.draft_mode">
                  · {{ game.draft_mode | draftMode }}</span
                >
              </div>
              {{ game.west_players }}v{{ game.east_players }}
            </td>
            <td style="white-space: nowrap">
              <v-chip
                v-if="game.winning_team"
                x-small
                :color="
                  game.winning_team === game.team
                    ? 'green darken-3'
                    : 'red darken-3'
                "
                text-color="white"
                class="mr-1"
                >{{ game.winning_team === game.team ? "Won" : "Lost" }}</v-chip
              >
              <span class="caption grey--text">{{
                getRoundResults(game)
              }}</span>
            </td>
            <td>
              <v-tooltip
                v-for="race in uniqueRaces(game.races)"
                :key="race"
                top
                color="red darken-3"
              >
                <template v-slot:activator="{ on }">
                  <router-link :to="'/races/' + race" v-on="on">
                    <img
                      :src="getRaceImage(race)"
                      :alt="race"
                      class="race-thumb"
                    />
                  </router-link>
                </template>
                <span>{{ race }}</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="Math.ceil(games.length / itemsPerPage)"
        :total-visible="7"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    page: 1,
    itemsPerPage: 15,
    gamesToShow: [],
  }),

  props: {
    games: Array,
  },
  components: {},
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
    },
    uniqueRaces(races) {
      if (!races) return [];
      return [...new Set(races.map((r) => r.replace(/\[|\]/g, "")))];
    },
    getRaceImage(race) {
      const parsed = race.toLowerCase().replace(/ /g, "_");
      return require(`../../assets/races/${parsed}_small.jpg`);
    },
  },
};
</script>

<style scoped>
th {
  text-align: center !important;
}

.race-thumb {
  width: 48px;
  height: 27px;
  object-fit: cover;
  border-radius: 2px;
  margin-right: 3px;
  vertical-align: middle;
  opacity: 0.85;
  transition: opacity 0.15s;
}

.race-thumb:hover {
  opacity: 1;
}
</style>
