<template>
  <v-app id="inspire">
    <Header></Header>
    <div class="content">
      <router-view></router-view>
    </div>
  </v-app>
</template>
 
<script>
import Header from "./components/Header";

export default {
  name: "home",
  components: {
    Header
  },
  created() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
 
<style>
.content {
  margin: 0 auto;
}

thead {
  background-color: #4e403a;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

th {
  padding: 2px 8px;
}

td {
  padding: 2px 8px;
}

tbody > tr:nth-child(even) {
  background-color: #2e2724;
}

tbody > tr:nth-child(odd) {
  background-color: #1d0e0e;
}

.west-color {
  color: #9be015ba;
}

.east-color {
  color: #f36e6e;
}
</style>