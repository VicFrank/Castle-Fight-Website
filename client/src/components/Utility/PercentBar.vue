<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <div class="segment" v-bind:style="{width: getWidth}" v-on="on"></div>
    </template>
    <span>{{width}}</span>
  </v-tooltip>
</template>
<script>
export default {
  props: {
    percent: String,
    min: Number,
    max: Number,
    value: [Number, String],
    width: String
  },

  computed: {
    getWidth: function() {
      if (this.width) return this.width;
      const percent = (100 * this.value) / this.max;
      return `${percent}%`;
    }
  }
};
</script>

<style scoped>
.segment {
  background-color: #ffffffe3;
  height: 4px;
}
</style>