<template>
  <v-container id="#">
    <v-row>
      <v-col cols="12">
        <v-card :color="theme.global.name.value === 'customLight' ? 'transparent' : null" class="py-4">
          <v-card-title class="pt-0 text-center text-wrap my-auto text-h5 font-weight-bold">Recently added on
            Moreview</v-card-title>
          <div class="d-flex justify-space-around">
            <!-- <v-card-title class="text-center my-auto">Just<br>added</v-card-title> -->
            <v-slide-group center-active show-arrows>
              <v-slide-group-item v-for="(latest, index) in latestMovie" :key="index">
                <img @click="navigateItem(latest)" :src="latest.poster" alt="Latest movie poster" height="300px"
                  class="ma-3 cursor-pointer" />
              </v-slide-group-item>
            </v-slide-group>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="my-4">
      <v-col>
        <v-card-title 
          class="pt-0 text-center text-h5 font-weight-bold primary--text mb-4"
        >
          Most Popular
        </v-card-title>

        <v-slide-group 
          show-arrows
          class="pa-2"
        >
          <v-slide-group-item 
            v-for="movie in mostPopular" 
            :key="movie.id"
            v-slot="{ isSelected }"
          >
            <v-card
              @click="navigateItem(movie)"
              :elevation="isSelected ? 6 : 2"
              :class="isSelected ? 'mx-2' : 'mx-1'"
              class="my-2 transition-swing movie-card"
              width="220"
              height="420"
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
                <span class="text-truncate text-center font-weight-medium">{{ movie.title }}</span>
              </v-card-title>
            
              <v-card-text class="px-3 pt-1 pb-2 justify-center d-flex">
                <v-chip-group 
                  class="d-flex justify-space-between flex-wrap" 
                  @click.stop
                >
                  <v-chip
                    size="small"
                    class="ma-1"
                    color="primary"
                    variant="outlined"
                  >
                    {{ movie.release_year }}
                  </v-chip>

                  <v-chip
                    size="small"
                    class="ma-1"
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
                    class="ma-1"
                    color="warning"
                    variant="flat"
                  >
                    <v-icon size="small" class="mr-1">mdi-star</v-icon>
                    <span>{{ (movie.comments.reduce((acc, comment) => acc + comment.rating, 0) / 
                      movie.comments.length).toFixed(1) }}</span>
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <v-row class="my-4">
      <v-col>
        <v-card-title 
          class="pt-0 text-center text-h5 font-weight-bold primary--text mb-4"
        >
          Highest Rated
        </v-card-title>
        
        <v-slide-group 
          show-arrows
          class="pa-2"
        >
          <v-slide-group-item 
            v-for="movie in mostLiked" 
            :key="movie.id"
            v-slot="{ isSelected }"
          >
            <v-card
              @click="navigateItem(movie)"
              :elevation="isSelected ? 6 : 2"
              :class="isSelected ? 'mx-2' : 'mx-1'"
              class="my-2 transition-swing movie-card"
              width="220"
              height="420"
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
                <span class="text-truncate text-center font-weight-medium">{{ movie.title }}</span>
              </v-card-title>
            
              <v-card-text class="px-3 pt-1 pb-2 justify-center d-flex">
                <v-chip-group 
                  class="d-flex justify-space-between flex-wrap" 
                  @click.stop
                >
                  <v-chip
                    size="small"
                    class="ma-1"
                    color="primary"
                    variant="outlined"
                  >
                    {{ movie.release_year }}
                  </v-chip>
                  
                  <v-chip
                    size="small"
                    class="ma-1"
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
                    class="ma-1"
                    color="warning"
                    variant="flat"
                  >
                    <v-icon size="small" class="mr-1">mdi-star</v-icon>
                    <span>{{ (movie.comments.reduce((acc, comment) => acc + comment.rating, 0) / 
                      movie.comments.length).toFixed(1) }}</span>
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <v-row class="my-4">
      <v-col>
        <v-card-title 
          class="pt-0 text-center text-h5 font-weight-bold primary--text mb-4"
        >
          Popular Movies
        </v-card-title>
        
        <v-slide-group 
          show-arrows
          class="pa-2"
        >
          <v-slide-group-item 
            v-for="movie in movieOnly" 
            :key="movie.id"
            v-slot="{ isSelected }"
          >
            <v-card
              @click="navigateItem(movie)"
              :elevation="isSelected ? 6 : 2"
              :class="isSelected ? 'mx-2' : 'mx-1'"
              class="my-2 transition-swing movie-card"
              width="220"
              height="420"
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
                <span class="text-truncate text-center font-weight-medium">{{ movie.title }}</span>
              </v-card-title>
            
              <v-card-text class="px-3 pt-1 pb-2 justify-center d-flex">
                <v-chip-group 
                  class="d-flex justify-space-between flex-wrap" 
                  @click.stop
                >
                  <v-chip
                    size="small"
                    class="ma-1"
                    color="primary"
                    variant="outlined"
                  >
                    {{ movie.release_year }}
                  </v-chip>
                  
                  <v-chip
                    size="small"
                    class="ma-1"
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
                    class="ma-1"
                    color="warning"
                    variant="flat"
                  >
                    <v-icon size="small" class="mr-1">mdi-star</v-icon>
                    <span>{{ (movie.comments.reduce((acc, comment) => acc + comment.rating, 0) / 
                      movie.comments.length).toFixed(1) }}</span>
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <v-row class="my-4">
      <v-col>
        <v-card-title 
          class="pt-0 text-center text-h5 font-weight-bold primary--text mb-4"
        >
          Popular Series
        </v-card-title>
        
        <v-slide-group 
          show-arrows
          class="pa-2"
        >
          <v-slide-group-item 
            v-for="movie in seriesOnly" 
            :key="movie.id"
            v-slot="{ isSelected }"
          >
            <v-card
              @click="navigateItem(movie)"
              :elevation="isSelected ? 6 : 2"
              :class="isSelected ? 'mx-2' : 'mx-1'"
              class="my-2 transition-swing movie-card"
              width="220"
              height="420"
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
                <span class="text-truncate text-center font-weight-medium">{{ movie.title }}</span>
              </v-card-title>
            
              <v-card-text class="px-3 pt-1 pb-2 justify-center d-flex">
                <v-chip-group 
                  class="d-flex justify-space-between flex-wrap" 
                  @click.stop
                >
                  <v-chip
                    size="small"
                    class="ma-1"
                    color="primary"
                    variant="outlined"
                  >
                    {{ movie.release_year }}
                  </v-chip>
                  
                  <v-chip
                    size="small"
                    class="ma-1"
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
                    class="ma-1"
                    color="warning"
                    variant="flat"
                  >
                    <v-icon size="small" class="mr-1">mdi-star</v-icon>
                    <span>{{ (movie.comments.reduce((acc, comment) => acc + comment.rating, 0) / 
                      movie.comments.length).toFixed(1) }}</span>
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <v-footer id="about" class="bg-primary">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <h3 class="text-h6 font-weight-bold mb-4 text-white">Moreview</h3>
          <p class="text-body-2 text-white">Your ultimate destination for movie information and reviews. Browse genres, discover new films, and keep track of your favorites.</p>
        </v-col>
        
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <h3 class="text-subtitle-1 font-weight-bold mb-4 text-white">Quick Links</h3>
          <v-list class="bg-transparent pa-0">
            <v-list-item href="/#" class="pa-0 mb-2">
              <v-list-item-title class="text-white">Home</v-list-item-title>
            </v-list-item>
            <v-list-item href="/movie" class="pa-0 mb-2">
              <v-list-item-title class="text-white">Movies</v-list-item-title>
            </v-list-item>
            <v-list-item href="/series" class="pa-0 mb-2">
              <v-list-item-title class="text-white">Series</v-list-item-title>
            </v-list-item>
            <v-list-item href="/#about" class="pa-0">
              <v-list-item-title class="text-white">About Us</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        
        <v-col cols="12" md="4">
          <h3 class="text-subtitle-1 font-weight-bold mb-4 text-white">Connect With Us</h3>
          <div class="d-flex">
            <!-- <v-btn icon class="mr-4">
              <v-icon :color="theme.global.name.value === 'customLight' ? 'black' : 'white'">mdi-facebook</v-icon>
            </v-btn> -->
            <v-btn icon class="mr-4" href="https://x.com/MoreviewSocial" target="_blank">
              <v-icon :color="theme.global.name.value === 'customLight' ? 'black' : 'white'">mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon class="mr-4" href="https://instagram.com/mrgn.projects" target="_blank">
              <v-icon :color="theme.global.name.value === 'customLight' ? 'black' : 'white'">mdi-instagram</v-icon>
            </v-btn>
            <!-- <v-btn icon>
              <v-icon :color="theme.global.name.value === 'customLight' ? 'black' : 'white'">mdi-youtube</v-icon>
            </v-btn> -->
          </div>
        </v-col>
      </v-row>
      
      <v-divider class="my-4 bg-white"></v-divider>
      
      <div class="d-flex flex-column flex-md-row justify-space-between align-center">
        <div class="text-center text-md-left text-body-2 text-white">
          &copy; {{ new Date().getFullYear() }} Moreview. All rights reserved.
        </div>
        <div class="mt-3 mt-md-0 text-center text-md-right">
          <a href="mailto:halomrgn@gmail.com" class="text-decoration-none text-white text-body-2 mr-4">Approach us at <span class="text-decoration-underline">halomrgn@gmail.com</span></a>
        </div>
      </div>
    </v-container>
  </v-footer>
  </v-container>
</template>

<style>
.v-slide-group__prev,
.v-slide-group__next {
  display: none !important;
}
</style>

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
const movieOnly = ref([]);
const seriesOnly = ref([]);

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
      movieOnly.value = data
        .filter((item) => item.typeMov === "movie")
        .sort((a, b) => {
          const aRating = a.comments.length > 0 ? a.comments.reduce((acc, comment) => acc + comment.rating, 0) / a.comments.length : 0;
          const bRating = b.comments.length > 0 ? b.comments.reduce((acc, comment) => acc + comment.rating, 0) / b.comments.length : 0;
          return bRating - aRating;
        })
        .slice(0, 10);
      seriesOnly.value = data
        .filter((item) => item.typeMov === "series")
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
