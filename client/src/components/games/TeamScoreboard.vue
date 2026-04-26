<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th>Race</th>
          <th>Player</th>
          <th>Income</th>
          <th>MMR</th>
          <th>Buildings</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in players" :key="index">
          <td class="race-column">
            <RaceLink v-bind:race="player.race"></RaceLink>
          </td>
          <td class="player-column">
            <template v-if="player.player_id">
              <router-link :to="'/players/' + player.steam_id">{{
                player.username
              }}</router-link>
            </template>
            <template v-else>Bot Player</template>
          </td>
          <td style="width: 81px">{{ player.income }}</td>
          <td class="mmr-change-column">
            <span
              v-if="player.mmr_change != null"
              :class="player.mmr_change > 0 ? 'mmr-gain' : 'mmr-loss'"
              >{{ player.mmr_change > 0 ? "+" : ""
              }}{{ player.mmr_change }}</span
            >
            <span v-else class="mmr-unranked">—</span>
          </td>
          <td class="build-order-column">
            <span
              v-for="(buildEvent, index) in player.build_order"
              :key="buildEvent.buildTime + index"
            >
              <BuildingLink
                v-bind:building="buildEvent.building"
                v-bind:buildTime="buildEvent.buildTime"
              ></BuildingLink>
            </span>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import BuildingLink from "../buildings/BuildingLink";
import RaceLink from "../races/RaceLink";

export default {
  props: {
    players: Array,
  },

  components: {
    BuildingLink,
    RaceLink,
  },
};
</script>

<style>
.race-column {
  width: 96px;
}

.player-column {
  width: 250px;
  text-align: left !important;
}

.mmr-change-column {
  width: 70px;
  text-align: center !important;
}

.mmr-gain {
  color: #4caf50;
  font-weight: bold;
}

.mmr-loss {
  color: #f44336;
  font-weight: bold;
}

.mmr-unranked {
  color: grey;
}

.build-order-column {
  text-align: left !important;
}
</style>
