<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card :color="theme.global.name.value === 'customLight' ? 'transparent' : null" class="py-4">
          <v-card-title
            class="pt-0 text-center text-wrap my-auto text-h5 font-weight-bold"
            >Recently added on Moreview</v-card-title
          >
          <div class="d-flex justify-space-around">
            <!-- <v-card-title class="text-center my-auto">Just<br>added</v-card-title> -->
            <v-slide-group center-active show-arrows>
              <v-slide-group-item
                v-for="(latest, index) in latestMovie"
                :key="index"
              >
                <img
                  @click="navigateItem(latest)"
                  :src="latest.poster"
                  alt="Latest movie poster"
                  height="300px"
                  class="ma-3 cursor-pointer"
                />
              </v-slide-group-item>
            </v-slide-group>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-card-title width="100" class="pt-0 text-center text-wrap mx-auto my-auto text-h5 font-weight-bold">
        Most popular
      </v-card-title>
      <v-col
        v-for="movie in mostPopular"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card @click="navigateItem(movie)" :color="theme.global.name.value === 'customLight' ? 'transparent' : null">
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

    <v-row>
      <v-card-title width="100" class="pt-0 text-center mx-auto text-wrap my-auto text-h5 font-weight-bold">
        Most liked 
      </v-card-title>
      <v-col
        v-for="movie in mostLiked"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="overflow-x-auto"
      >
        <v-card @click="navigateItem(movie)" :color="theme.global.name.value === 'customLight' ? 'transparent' : null">
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
const toggleTheme = inject("toggleTheme");

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

const navigateItem = (item) => {
  if (item.typeMov === "movie") {
    navigateTo(`/movie/${item.id}`);
  } else {
    navigateTo(`/series/${item.id}`);
  }
};

const movies = ref([]);
const latestMovie = ref([]);
const mostPopular = ref([]);
const mostLiked = ref([]);

const getMovies = async () => {
  try {
    const response = await fetch("/api/movie/unarchived");
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      movies.value = data.slice().sort(() => Math.random() - 0.5);
      latestMovie.value = data
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
      mostPopular.value = data
        .slice()
        .sort((a, b) => b.comments.length - a.comments.length)
        .slice(0, 10);
      mostLiked.value = data
        .slice()
        .sort((a, b) => {
          const aRating = a.comments.length > 0 ? a.comments.reduce((acc, comment) => acc + comment.rating, 0) / a.comments.length : 0;
          const bRating = b.comments.length > 0 ? b.comments.reduce((acc, comment) => acc + comment.rating, 0) / b.comments.length : 0;
          return bRating - aRating;
        })
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
