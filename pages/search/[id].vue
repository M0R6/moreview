<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" color="transparent">
          <!-- <div class="d-flex justify-space-around">
            <v-card-title class="text-center my-auto">Watch</v-card-title>
            <v-img v-if="randomMovie" :src="randomMovie.poster" height="300px"></v-img>
            <v-card-title class="text-center my-auto">Now!</v-card-title>
          </div>
          <v-card-title v-if="randomMovie" class="text-center">{{ randomMovie.title }}</v-card-title> -->
          <!-- <v-form class="flex-wrap d-flex justify-space-between align-center">
            <v-card-title class="text-center my-auto text-wrap">Search for movie reviews now!</v-card-title>
            <v-text-field class="my-auto pa-4" hide-details variant="outlined" rounded="lg" max-width="300px" width="100%" label="Search" v-model="search" append-inner-icon="mdi-magnify"></v-text-field>
          </v-form> -->
          <v-card-title v-if="movies.length > 0" class="font-bold text-h4">
            Here are the results for "{{ route.params.id }}":
          </v-card-title>
          <v-card-title v-else class="font-bold justify-center d-flex my-auto align-center text-h4">
            Sorry, there are no results for "{{ route.params.id }}"
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="movie in movies" :key="movie.id" cols="12" sm="6" md="4" lg="3">
        <v-card color="transparent">
          <v-card-title class="text-truncate text-center">{{ movie.title }}</v-card-title>
          <v-img :src="movie.poster" max-height="350px" height="100%"></v-img>
          <v-card-text class="text-truncate">{{ movie.description }}</v-card-text>
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

const route = useRoute();
const id = ref(route.params.id);
const movies = ref([]);
const randomMovie = ref(null);
const showToast = inject("showToast");

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
