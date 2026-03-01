<template>
  <v-container class="text-center py-12">
    <v-icon size="80" color="grey darken-1" class="mb-4"
      >mdi-map-marker-question</v-icon
    >
    <h1 class="display-1 mb-4">Page Not Found</h1>
    <p class="subtitle-1 grey--text">
      The page you're looking for doesn't exist.
    </p>
    <v-btn color="red darken-3" to="/" class="mt-4">Back to Home</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "not-found",
};
</script>
