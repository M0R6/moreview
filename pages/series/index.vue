<template>
  <v-container>
    <v-row class="my-4">
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="pa-2"
      >
        <v-card
          @click="navigateTo(`/series/${movie.id}`)"
          :elevation="2"
          class="my-2 transition-swing movie-card"
          height="450"
          :color="theme.global.name.value === 'customLight' ? 'white' : null"
          hover
        >
          <v-img 
            v-if="movie.poster" 
            :src="movie.poster" 
            height="280"
            cover
            class="rounded-t"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>

          <v-card-title class="d-flex justify-center align-center px-3 pt-3 pb-0 text-subtitle-1">
            <span class="text-wrap text-center font-weight-medium">{{ movie.title }}</span>
          </v-card-title>

          <v-card-text class="px-3 pt-4 pb-2">
            <div class="d-flex flex-wrap justify-center">
              <v-chip
              size="small"
              class="mx-1 my-1"
              color="primary"
              variant="outlined"
              >
              {{ movie.release_year }}
              </v-chip>
              
              <v-chip
              size="small"
              class="mx-1 my-1"
              color="secondary"
              variant="outlined"
              >
              {{
                movie.rating === "PG13"
                ? "PG-13"
                : movie.rating === "NC17"
                ? "NC-17"
                : movie.rating
              }}
              </v-chip>
              
              <v-chip
              size="small"
              class="mx-1 my-1"
              color="warning"
              variant="flat"
              >
              <v-icon size="small" class="mr-1">mdi-star</v-icon>
              <span>{{ (movie.comments.reduce((acc, comment) => acc + comment.rating, 0) / 
                movie.comments.length).toFixed(1) }}</span>
              </v-chip>
              
              <v-chip
              size="small"
              class="mx-1 my-1"
              color="info"
              variant="outlined"
              >
              {{ movie.episode }} eps
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useHead } from "#imports";
import { ref, onMounted, inject } from "vue";

const theme = inject("theme");

useHead({
  title: "Dashboard - Moreview",
  meta: [
    { name: "description", content: "Create an account on Moreview" },
    { name: "keywords", content: "Moreview, Register, Account" },
  ],
});

definePageMeta({
  auth: {
    unauthenticatedOnly: false,
  },
});

const movies = ref([]);
const latestMovie = ref([]);

const getMovies = async () => {
  try {
    const response = await fetch("/api/movie/unarchivedSeries");
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      movies.value = data.slice().sort(() => Math.random() - 0.5);
      latestMovie.value = data
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

onMounted(() => {
  getMovies();
});
</script>