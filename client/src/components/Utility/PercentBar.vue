<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <div class="segment" v-bind:style="{width: width}" v-on="on"></div>
    </template>
    <span>{{width}}</span>
  </v-tooltip>
</template>
<script>
export default {
  props: {
    width: String
  }
};
</script>

<style scoped>
.segment {
  background-color: #ffffffe3;
  height: 4px;
}
</style>