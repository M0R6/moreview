<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" color="transparent">
          <v-card-title v-if="movies.length > 0" class="font-bold text-h4 text-wrap">
            Here are the results for <span class="text-red">{{ route.params.id }}</span>:
          </v-card-title>
          <v-card-title v-else class="font-bold text-h4 text-wrap">
            Sorry, there's no results for <span class="text-red">{{ route.params.id }}</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="movie in movies"
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
  </v-container>
</template>

<script setup>
import { useHead, useRoute } from '#imports'; // ✅ Import useRoute from Nuxt

useHead({
  title: 'Dashboard - Moreview',
  meta: [
    { name: 'description', content: 'Create an account on Moreview' },
    { name: 'keywords', content: 'Moreview, Register, Account' },
  ]
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

const route = useRoute();
const id = ref(route.params.id);
const movies = ref([]);
const randomMovie = ref(null);
const showToast = inject("showToast");
const theme = inject("theme");

const getMovies = async () => {
  try {
    const response = await fetch(`/api/movie/search/${id.value}`);
    if (!response.ok) throw new Error('Failed to fetch movies');
    
    const data = await response.json();
    movies.value = data;
    
    if (data.length > 0) {
      randomMovie.value = data[Math.floor(Math.random() * data.length)];
    } else {
      randomMovie.value = null;
      showToast("There's no data", "error");
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

watchEffect(() => {
  id.value = route.params.id;
  getMovies();
});

onMounted(() => {
  getMovies();
});
</script>
