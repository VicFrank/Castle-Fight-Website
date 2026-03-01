<template>
  <v-app id="inspire">
    <Header></Header>
    <v-main>
      <div class="content">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header";

export default {
  name: "home",
  components: {
    Header,
  },
  created() {
    this.$vuetify.theme.dark = true;
  },
};
</script>

<style>
.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

a {
  text-decoration: none;
  color: #4fa8ef;
}

a:hover {
  text-decoration: underline;
}

thead {
  background-color: rgba(255, 255, 255, 0.04);
}

thead th {
  font-size: 11px !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.sortable {
  cursor: pointer;
}

tbody > tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

tbody > tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.02);
}

tbody > tr:nth-child(odd) {
  background-color: transparent;
}

tbody > tr:hover {
  background-color: rgba(255, 255, 255, 0.07) !important;
}

.west-color {
  color: #9be015ba;
}

.east-color {
  color: #f36e6e;
}

h1 {
  margin-bottom: 12px;
}
</style>
