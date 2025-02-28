<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-card :color="theme.global.name.value === 'customLight' ? 'white' : null" v-if="movie" elevation="3">
          <v-row>
            <v-col class="d-flex justify-center align-center" cols="12" md="3">
              <v-img
                v-if="movie.poster"
                :src="movie.poster"
                max-width="300"
                width="100%"
                class="d-flex align-center"
                cover
              ></v-img>
            </v-col>
            <v-col>
              <v-card-title class="px-0 pb-0 text-h5 font-weight-bold">
                {{ movie.title }}
              </v-card-title>
              <v-card-subtitle class="px-0">
                {{ movie.release_year + ' • ' + movie.duration + ' mins' + ' • '}} {{ movie.rating === 'PG13' ? 'PG-13' : movie.rating === 'NC17' ? 'NC-17' : movie.rating }}
              </v-card-subtitle>
              <v-card-text class="px-0">
                <p>{{ movie.description }}</p>
                <v-chip-group v-if="movie.genres_relations" class="mt-2">
                  <v-chip
                    v-for="genre in movie.genres_relations"
                    :key="genre.genre.id"
                    color="primary"
                  >
                    {{ genre.genre.title }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
        <v-alert v-else type="error">Movie with ID '{{ route.params.id }}' not found.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
 
 <script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, inject } from "vue";

const theme = inject("theme");

const route = useRoute();
const movie = ref(null);
const error = ref(null);

definePageMeta({
  auth: {
    unauthenticatedOnly: false,
  },
});

const fetchMovieDetails = async () => {
  try {
    const response = await fetch(`/api/movie/${route.params.id}`);
    if (!response.ok)
      throw new Error(`Error ${response.status}: ${await response.text()}`);

    movie.value = await response.json();
  } catch (err) {
    console.error("Error fetching movie:", err);
    error.value = err.message;
  }
};

onMounted(() => {
  fetchMovieDetails();
});
</script>
 
 <style scoped>
.v-card {
  padding: 16px;
}
</style>
