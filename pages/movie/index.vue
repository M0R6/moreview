<template>
  <v-container>
    <v-row>
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card @click="navigateTo(`/movie/${movie.id}`)" :color="theme.global.name.value === 'customLight' ? 'transparent' : null">
          <v-card-title class="d-flex justify-center align-center">
            <span class="text-truncate text-center">{{ movie.title }}</span>
          </v-card-title>

          <v-card-text class="d-flex justify-center align-center">
            <v-chip-group class="d-flex justify-space-between" @click.stop>
              <!-- <v-chip>{{ movie.typeMov === "movie" ? movie.duration + ' mins' : movie.episode }}</v-chip> -->
              <v-chip>{{ movie.release_year }}</v-chip>
              <v-chip>{{ 
                    movie.rating === "PG13"
                    ? "PG-13"
                    : movie.rating === "NC17"
                    ? "NC-17"
                    : movie.rating
              }}</v-chip>
                <v-chip class="d-flex align-center justify-center">
                  <v-icon class="mr-1">mdi-star</v-icon>
                  <span class="align-end">{{ (movie.comments.reduce((acc, comment) => acc + comment.rating, 0) / movie.comments.length).toFixed(1) }}</span>
                </v-chip>
            </v-chip-group>
          </v-card-text>
          <v-img
            v-if="movie.poster"
            :src="movie.poster"
            max-height="350px"
            height="100%"
          ></v-img>
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
    const response = await fetch("/api/movie/unarchivedMovies");
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