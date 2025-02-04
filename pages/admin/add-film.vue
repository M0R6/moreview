<template>
  <v-container>
    <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto pa-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-movie</v-icon>
        <h2 class="text-wrap">Create Film</h2>
      </v-card-title>
      <v-card-text>
        <v-form v-model="form" @submit.prevent="onSubmit">
          <v-text-field
            v-model="film.title"
            label="Title"
            :rules="[v => !!v || 'Title is required']"
            required
            variant="outlined"
          ></v-text-field>

          <v-textarea
            v-model="film.description"
            label="Description"
            variant="outlined"
          ></v-textarea>

          <v-text-field
            v-model="film.release_year"
            label="Release Year"
            type="number"
            :rules="[v => !!v || 'Release year is required']"
            required
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="film.duration"
            label="Duration (minutes)"
            type="number"
            :rules="[v => !!v || 'Duration is required']"
            required
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="film.rating"
            label="Rating (e.g., PG-13, R)"
            :rules="[v => !!v || 'Rating is required']"
            required
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="film.creator"
            label="Creator (Director/Studio)"
            :rules="[v => !!v || 'Creator is required']"
            required
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="film.trailer"
            label="Trailer URL"
            variant="outlined"
          ></v-text-field>

          <v-select
            v-model="film.genreIds"
            :items="genres"
            item-title="title"
            item-value="id"
            label="Genres"
            multiple
            variant="outlined"
          ></v-select>

          <v-btn type="submit" color="primary" block class="mt-2">Create Film</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";

const film = ref({
  title: "",
  description: "",
  release_year: "",
  duration: "",
  rating: "",
  creator: "",
  trailer: "",
  genreIds: [],
});

const genres = ref([]);
const form = ref(false);

onMounted(async () => {
  const { data: genreData } = await useFetch("/api/genre/getGenre");
  genres.value = genreData.value || [];
});

// Submit the form
const onSubmit = async () => {
  if (!form.value) {
    alert("Please fill out all required fields.");
    return;
  }

  await $fetch("/api/movie/add", {
    method: "POST",
    body: {
      ...film.value,
      release_year: parseInt(film.value.release_year),
      duration: parseInt(film.value.duration),
      rating: parseInt(film.value.rating),
    },
  });

  alert("Film created successfully!");
  film.value = {
    title: "",
    description: "",
    release_year: "",
    duration: "",
    rating: "",
    creator: "",
    trailer: "",
    genreIds: [],
  };
};
</script>