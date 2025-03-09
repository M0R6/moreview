<template>
  <v-container>
    <v-form @submit.prevent="addCastRelation">
      <v-select variant="outlined" no-data-text="You haven't publish any movie" v-model="selectedFilm" :items="movies" item-title="title" item-value="id" label="Select Film"></v-select>
      <v-select variant="outlined" v-model="selectedCast" :items="castList" item-title="name" item-value="id" label="Select Cast"></v-select>
      <v-text-field variant="outlined" v-model="characterName" label="Character Name"></v-text-field>
      <v-btn type="submit" color="primary">Assign</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useHead } from "#imports";

useHead({
  title: "Manage Cast - Moreview",
  meta: [
    { name: "description", content: "Admin manage cast on Moreview" },
    { name: "keywords", content: "Moreview, Manage cast, cast, actor, Account" },
  ],
});

const { $moment } = useNuxtApp();

const { data } = useAuth();

const userA = ref(null);
const isAdmin = computed(() => userA.value?.role === "author");
const showToast = inject("showToast");

const getAuthUser = async () => {
  try {
    if (!data.value?.user) {
      throw new Error("User data is not available");
    }

    const response = await fetch(`/api/user/${data.value.user.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const userData = await response.json();
    userA.value = userData;

    if (!isAdmin.value) {
      showToast("Access denied", "error");
      setTimeout(() => {
        navigateTo("/")
      }, 1000);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const addCastRelation = async () => {
  try {
    const { data, error } = await useFetch("/api/cast/addRelation", {
      method: "POST",
      body: {
        film_id: selectedFilm.value,
        cast_id: selectedCast.value,
        character_name: characterName.value,
        createdBy: userA.value.id,
      },
    });

    if (error.value) {
      throw new Error(error.value.statusMessage || "Failed to add cast relation");
    }

    console.log("Added Cast Relation:", data.value);
    selectedCast.value = "";
    selectedFilm.value = "";
    characterName.value = "";
    showToast("Cast relation added successfully", "success");
  } catch (error) {
    console.error("Error adding cast relation:", error);
    showToast(error.message || "Failed to add cast relation", "error");
  }
};

const movies = ref([]) // Fetch from API
const castList = ref([]) // Fetch from API
const selectedFilm = ref('')
const selectedCast = ref('')
const characterName = ref('')

const fetchMovies = async () => {
  try {
    const response = await fetch(`/api/movie/author/${userA.value.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    movies.value = data || [];
    console.log([data]);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

const fetchCasts = async () => {
  try {
    const response = await fetch(`/api/cast/getCast`);
    if (!response.ok) {
      throw new Error("Failed to fetch casts");
    }
    const data = await response.json();
    console.log("Fetched Data:", data);
    castList.value = data || [];
  } catch (error) {
    console.error("Error fetching casts:", error);
  }
};

onMounted(async () => {
  await getAuthUser();
  await fetchCasts();
  await fetchMovies();
});

const assignCast = () => {
  console.log('Assigning:', { film: selectedFilm.value, cast: selectedCast.value, character: characterName.value })
}
</script>
