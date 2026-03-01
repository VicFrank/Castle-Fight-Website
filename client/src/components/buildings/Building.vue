<template>
  <v-container class="text-center py-8">
    <h1>
      {{ $route.params.building_name | underscoreToSpace | capitalizeWords }}
    </h1>
    <v-icon size="64" color="grey" class="my-4">mdi-office-building</v-icon>
    <p class="subtitle-1 grey--text">
      Detailed building stats are coming soon.
    </p>
    <v-btn text color="blue" @click="$router.back()">Go Back</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "building",
};
</script>
