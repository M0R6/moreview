<script setup>
import { ref, onMounted, inject } from "vue";
import { useHead } from "#imports";

const theme = inject("theme");

useHead({
  title: "Manage Movies - Moreview",
  meta: [
    { name: "description", content: "Admin manage movies on Moreview" },
    { name: "keywords", content: "Moreview, Manage movies, movies, Account" },
  ],
});

const { $moment } = useNuxtApp();
const { data } = useAuth();
const userA = ref(null);
const isAdmin = computed(() => userA.value?.role === "admin");

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
const showToast = inject("showToast");

// Movie Form
const title = ref("");
const movieType = ref("");
const description = ref("");
const poster = ref("");
const releaseYear = ref("");
const duration = ref("");
const episode = ref("");
const rating = ref("");
const creator = ref("");
const trailer = ref("");
const trailerUrl = ref("");
const genreIds = ref([]);
const form = ref(false);
const addMovieDialog = ref(false);
const genres = ref([]);

// Sort genres alphabetically by title
const sortedGenres = computed(() => {
  return genres.value.slice().sort((a, b) => a.title.localeCompare(b.title));
});

const uploadTrailer = ref(false);
const embedTrailer = ref(false);

const upload = () => {
  uploadTrailer.value = true;
  embedTrailer.value = false;
};

const embed = () => {
  uploadTrailer.value = false;
  embedTrailer.value = true;
};

// Fetch Movies
const movies = ref([]);
const search = ref("");
const loading = ref(true);

const fetchMovies = async () => {
  try {
    const response = await fetch("/api/movie/getMovie");
    loading.value = false;
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

const fetchGenres = async () => {
  try {
    const response = await fetch("/api/genre/getGenre");
    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }
    const data = await response.json();
    genres.value = data || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
};

onMounted(() => {
  fetchMovies();
  fetchGenres();
  getAuthUser();
});

const selectedPoster = ref(null);
const selectedTrailer = ref(null);

const handlePosterInput = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedPoster.value = file;
    poster.value = URL.createObjectURL(file); // Preview
  }
};

const handleTrailerInput = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedTrailer.value = file;
    trailer.value = URL.createObjectURL(file); // Preview
  }
};

// Convert File to Base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const uploadLoading = ref(false);

// Add Movie
const addMovie = async () => {
  try {

    uploadLoading.value = true;

    const posterBase64 = selectedPoster.value
      ? await convertFileToBase64(selectedPoster.value)
      : null;

    const trailerBase64 = selectedTrailer.value
      ? await convertFileToBase64(selectedTrailer.value)
      : null;

    const { data, error } = await useFetch("/api/movie/add", {
      method: "POST",
      body: {
        title: title.value,
        typeMov: movieType.value,
        description: description.value,
        poster: posterBase64,
        trailer: trailerBase64,
        trailerUrl: trailerUrl.value,
        release_year: parseInt(releaseYear.value),
        duration: parseInt(duration.value),
        episode: parseInt(episode.value),
        rating: rating.value,
        postedBy: userA.value.id,
        creator: creator.value,
        genreIds: genreIds.value,
      },
    });

    if (error.value) {
      uploadLoading.value = false;
      showToast(error.value.statusMessage, "error");
      return;
    }

    showToast("Movie added successfully", "success");
    uploadLoading.value = false;
    addMovieDialog.value = false;
    fetchMovies();
  } catch (error) {
    console.error("Error adding movie:", error);
    showToast("Failed to add movie. Please try again.", "error");
  } finally {
    if (poster.value) URL.revokeObjectURL(poster.value);
    if (trailer.value) URL.revokeObjectURL(trailer.value);
  }
};

const areYouSure = ref(false)
// Delete Movie
const deleteMovie = async (id) => {
  try {
    const response = await fetch(`/api/movie/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }

    showToast("Movie deleted successfully", "success");
    areYouSure.value = false;
    fetchMovies();
  } catch (error) {
    console.error("Error deleting movie:", error);
    showToast("Error deleting movie", "error");
  }
};

// ARchive Movie
const archiveMovie = async (id) => {
  try {
    const response = await fetch(`/api/movie/archive/${id}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Failed to archive movie");
    }

    showToast("Movie archived successfully", "success");
    fetchMovies();
  } catch (error) {
    console.error("Error archiving movie:", error);
    showToast("Error archiving movie", "error");
  }
};

// Restore Movie
const restoreMovie = async (id) => {
  try {
    const response = await fetch(`/api/movie/restore/${id}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Failed to restore movie");
    }

    showToast("Movie restored successfully", "success");
    fetchMovies();
  } catch (error) {
    console.error("Error restoring movie:", error);
    showToast("Error restoring movie", "error");
  }
};

// Edit Movie
const editMovieDialog = ref(false);
const editForm = ref(false);
const editId = ref(null);

const editMovie = (movie) => {
  editId.value = movie.id;
  title.value = movie.title;
  movieType.value = movie.typeMov;
  description.value = movie.description;
  poster.value = movie.poster;
  releaseYear.value = movie.release_year;
  duration.value = movie.duration;
  episode.value = movie.episode;
  rating.value = movie.rating;
  creator.value = movie.creator;
  trailer.value = movie.trailer;
  trailerUrl.value = movie.trailerUrl;
  genreIds.value = movie.genres_relations.map((relation) => relation.genre_id);
  editMovieDialog.value = true;
};

const updateMovie = async () => {
  try {
    uploadLoading.value = true;

    const posterBase64 = selectedPoster.value
      ? await convertFileToBase64(selectedPoster.value)
      : null;

    const trailerBase64 = selectedTrailer.value
      ? await convertFileToBase64(selectedTrailer.value)
      : null;

    const { data, error } = await useFetch(
      `/api/movie/update/${editId.value}`,
      {
        method: "PATCH",
        body: {
          title: title.value,
          typeMov: movieType.value,
          description: description.value,
          poster: posterBase64,
          release_year: releaseYear.value,
          duration: duration.value,
          episode: episode.value,
          rating: rating.value,
          creator: creator.value,
          trailer: trailerBase64,
          trailerUrl: trailerUrl.value,
          genreIds: genreIds.value,
        },
      }
    );

    if (error.value) {
      uploadLoading.value = false;
      showToast(error.value.statusMessage, "error");
      return;
    }
    showToast("Movie updated successfully", "success");
    uploadLoading.value = false;
    editMovieDialog.value = false;
    fetchMovies();
  } catch (error) {
    console.error("Error updating movie:", error);
    showToast("Failed to update movie. Please try again.", "error");
  } finally {
    if (poster.value) URL.revokeObjectURL(poster.value);
    if (trailer.value) URL.revokeObjectURL(trailer.value);
  }
};

// Date Formatting
const formatDate = (date) => {
  if (!date) return "-";

  const momentDate = $moment.utc(date).tz("Asia/Jakarta").locale("id");

  if (momentDate.isSame($moment(), "day")) {
    return `Today at ${momentDate.format("HH:mm:ss")}`;
  } else if (momentDate.isSame($moment().subtract(1, "day"), "day")) {
    return `Yesterday at ${momentDate.format("HH:mm:ss")}`;
  } else {
    return momentDate.format("LLLL");
  }
};

const formNull = () => {
  editMovieDialog.value = false;
  title.value = "";
  movieType.value = "";
  description.value = "";
  poster.value = "";
  releaseYear.value = "";
  duration.value = "";
  episode.value = "";
  rating.value = "";
  creator.value = "";
  trailer.value = "";
  trailerUrl.value = "";
  genreIds.value = [];
  form.value = false;
  addMovieDialog.value = false;
  uploadTrailer.value = false;
  embedTrailer.value = false;
  selectedPoster.value = null;
  selectedTrailer.value = null;
};

// View Movie Data
const viewMovieDialog = ref(false);
const viewMovieData = ref(null);

const viewMovie = (movie) => {
  viewMovieDialog.value = true;
  viewMovieData.value = movie;
};

const movieRate = (['G', 'PG', 'PG13', 'R', 'NC17']);
const seriesRate = (['TVY', 'TVY7', 'TVG', 'TVPG', 'TV14', 'TVMA']);

const selectedFilms = ref([]);
const bulkDeleteDialog = ref(false);
const bulkArchiveDialog = ref(false);

const deleteSelectedFilms = async () => {
  if (selectedFilms.value.length === 0) {
    showToast("No Genres selected", "warning");
    return;
  }

  try {
    const response = await fetch("/api/movie/delete/bulk", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedFilms.value }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete films");
    }

    showToast("Films deleted successfully", "success");
    selectedFilms.value = []; // Clear selection
    bulkDeleteDialog.value = false;
    fetchMovies(); // Refresh the list
  } catch (error) {
    console.error("Error deleting films:", error);
    showToast("Error deleting films", "error");
  }
};

const archiveSelectedFilms = async () => {
  if (selectedFilms.value.length === 0) {
    showToast("No films selected", "warning");
    return;
  }

  try {
    const response = await fetch("/api/movie/archive/bulk", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedFilms.value }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to archive films");
    }

    showToast("Films archived successfully", "success");
    selectedFilms.value = []; // Clear selection
    bulkArchiveDialog.value = false;
    fetchMovies(); // Refresh the list
  } catch (error) {
    console.error("Error archiving films:", error);
    showToast("Error archiiving films", "error");
  }
};

// Filter states
const genreFilter = ref(null);
const yearFilter = ref(null);
const ratingFilter = ref(null);

// Computed properties
const releaseYears = computed(() => {
  const years = [...new Set(movies.value.map(movie => movie.release_year))];
  return years.sort((a, b) => b - a); // Sort descending
});

const filtersActive = computed(() => {
  return genreFilter.value !== null || yearFilter.value !== null || ratingFilter.value !== null;
});


const filteredMovies = computed(() => {
  if (!filtersActive.value) {
    return movies.value;
  }
  
  return movies.value.filter(movie => {
    // Genre filter
    const genreMatch = !genreFilter.value || 
      movie.genres_relations.some(relation => relation.genre.id === genreFilter.value);
    
    // Year filter
    const yearMatch = !yearFilter.value || movie.release_year === yearFilter.value;
    
    // Rating filter
    let avgRating = 0;
    if (movie.comments && movie.comments.length > 0) {
      const totalRating = movie.comments.reduce((sum, comment) => sum + comment.rating, 0);
      avgRating = Math.floor(totalRating / movie.comments.length); // No decimal
    }
    
    // Rating filter using the calculated average
    const ratingMatch = !ratingFilter.value || avgRating === Number(ratingFilter.value);
    
    return genreMatch && yearMatch && ratingMatch;
  });
});

const resetFilters = () => {
  genreFilter.value = null;
  yearFilter.value = null;
  ratingFilter.value = null;
};
</script>

<template>
  <v-container v-if="isAdmin">

    <v-dialog v-model="bulkDeleteDialog">
         <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
         <v-card-title>Are you sure?</v-card-title>
         <v-card-text>
            Are you sure you want to delete <strong>{{ selectedFilms.length }}</strong> selected items?
         </v-card-text>
         <v-card-actions>
            <v-btn color="error" @click="deleteSelectedFilms">Yes</v-btn>
            <v-btn @click="bulkDeleteDialog = false">No</v-btn>
         </v-card-actions>
         </v-card>
      </v-dialog>

      <v-dialog v-model="bulkArchiveDialog">
         <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
         <v-card-title>Are you sure?</v-card-title>
         <v-card-text>
            Are you sure you want to archive <strong>{{ selectedFilms.length }}</strong> selected items?
         </v-card-text>
         <v-card-actions>
            <v-btn color="secondary" @click="archiveSelectedFilms">Yes</v-btn>
            <v-btn @click="bulkArchiveDialog = false">No</v-btn>
         </v-card-actions>
         </v-card>
      </v-dialog>

    <v-dialog v-model="uploadLoading">
      <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-upload</v-icon>
          <h2 class="text-wrap">Uploading</h2>
        </v-card-title>
        <v-card-text>
          <v-progress-linear
            indeterminate
            color="primary"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- View Movie Dialog -->
    <v-dialog v-model="viewMovieDialog" max-width="800px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <Icon class="mr-2" size="28" name="mdi:movie-open-outline" />
          <h2 class="text-wrap">Movie Details</h2>
        </v-card-title>
        <v-card-text v-if="viewMovieData">
          <v-row>
            <!-- Poster -->

            <!-- Movie Details -->
            <v-col cols="12" md="8">
              <v-list>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Title:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    viewMovieData?.title || "-"
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Type:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    viewMovieData?.typeMov === 'movie' ? 'Movie' : 'Series' || "-"
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Description:</v-list-item-title
                  >
                  <span>{{viewMovieData?.description || "-"}}</span>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Release Year:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    viewMovieData?.release_year ? formatDate(viewMovieData?.release_year) : "-"
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Duration:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    viewMovieData?.duration
                      ? `${viewMovieData.duration} minutes`
                      : "-"
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Rating:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    viewMovieData?.rating || "-"
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Creator:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    viewMovieData?.creator || "-"
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Genres:</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{
                      viewMovieData?.genres_relations
                        ?.map((relation) => relation.genre?.title)
                        .join(", ") || "-"
                    }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Created By:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    viewMovieData?.createdBy?.name || "-"
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Created At:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    formatDate(viewMovieData?.created_at)
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Updated At:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    formatDate(viewMovieData?.updated_at)
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="font-weight-bold"
                    >Archived At:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    formatDate(viewMovieData?.archived_at)
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="4">
              <v-img
                :src="viewMovieData?.poster || ''"
                alt="Movie Poster"
                class="rounded-lg"
                height="300"
                cover
              ></v-img>
            </v-col>
          </v-row>

          <!-- Trailer Section -->
          <v-row v-if="viewMovieData?.trailer || viewMovieData?.trailerUrl">
            <v-col cols="12">
              <h3 class="text-h6 mb-3">Trailer</h3>
              <video
                v-if="viewMovieData?.trailer"
                :src="viewMovieData?.trailer"
                controls
                class="w-100 rounded-lg"
              ></video>
              <iframe
                v-else
                :src="viewMovieData?.trailerUrl"
                class="w-100 rounded-lg"
                height="400"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="viewMovieDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog @after-leave="formNull" v-model="addMovieDialog">
      <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
        <v-card-title class="d-flex align-center">
          <Icon
            class="mr-2 my-auto"
            size="28"
            name="mdi:movie-open-plus-outline"
          />
          <h2 class="text-wrap">Add Movie</h2>
        </v-card-title>
        <v-card-text>
          <v-form v-model="form" @submit.prevent="addMovie">
            <v-text-field
              v-model="title"
              label="Title"
              required
              variant="outlined"
            ></v-text-field>
            <v-select
              v-model="movieType"
              :items="['movie', 'series']"
              label="Movie Type"
              required
              variant="outlined"
            ></v-select>
            <v-textarea
              v-model="description"
              label="Description"
              variant="outlined"
            ></v-textarea>
            <v-text-field
              v-model="releaseYear"
              label="Release Year"
              type="number"
              required
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-if="movieType === 'movie'"
              v-model="duration"
              type="number"
              label="Duration (minutes)"
              required
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-if="movieType === 'series'"
              v-model="episode"
              type="number"
              label="Episode"
              variant="outlined"
            ></v-text-field>
            <v-select
              v-model="rating"
              :items="movieType === 'movie' ? movieRate : seriesRate"
              label="Rating"
              required
              variant="outlined"
            ></v-select>
            <v-text-field
              v-model="creator"
              label="Creator"
              required
              variant="outlined"
            ></v-text-field>
            <v-file-input
              hide-details
              @input="handlePosterInput"
              label="Poster"
              accept="image/*"
              variant="outlined"
            ></v-file-input>
            <v-btn width="100%" class="d-flex mt-5" @click="embed">Embed Trailer</v-btn>
            <span class="pa-2 text-center justify-center d-flex">or</span>
            <v-btn width="100%" class="d-flex mb-5" @click="upload">Upload Trailer</v-btn>
            <v-file-input
              v-if="uploadTrailer"
              @input="handleTrailerInput"
              v-model="trailer"
              label="Trailer (File)"
              accept="video/*"
              variant="outlined"
            ></v-file-input>
            <v-text-field
              v-if="embedTrailer"
              v-model="trailerUrl"
              label="Trailer URL"
              variant="outlined"
            ></v-text-field>
            <v-autocomplete
              v-model="genreIds"
              :items="sortedGenres"
              item-title="title"
              item-value="id"
              label="Genres"
              multiple
              variant="outlined"
              chips
              closable-chips
            ></v-autocomplete>
            <v-btn type="submit" color="primary">Add Movie</v-btn>
            <v-btn @click="formNull" class="ml-2"
              >Cancel</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Movie Table -->
    <v-card elevation="4" :color="theme.global.name.value === 'customLight' ? 'transparent' : null">
      <v-card-title class="d-flex justify-space-between flex-wrap">
        <div class="d-flex flex-wrap">
          <div class="d-flex align-center" width="100%">
            <h2 class="mr-2">Movies</h2>
            <v-chip color="primary">{{ movies.length }}</v-chip>
          </div>
          <div class="align-center d-flex mt-2 mt-md-0 ml-0 ml-md-5">
            <v-btn
              color="primary"
              @click="addMovieDialog = true"
              icon="mdi-plus"
            ></v-btn>
          </div>
        </div>
        <div>
          <v-btn 
             color="secondary" 
             class="mt-3" 
             :disabled="selectedFilms.length === 0"
             v-if="selectedFilms.length > 0"
             @click="bulkArchiveDialog = true"
          >
             <v-icon left>mdi-archive</v-icon> Archive Selected ({{ selectedFilms.length }})
          </v-btn>
          <br>
          <v-btn 
             color="error" 
             class="mt-3" 
             :disabled="selectedFilms.length === 0"
             v-if="selectedFilms.length > 0"
             @click="bulkDeleteDialog = true"
          >
             <v-icon left>mdi-delete</v-icon> Delete Selected ({{ selectedFilms.length }})
          </v-btn>
          
          <div class="d-flex flex-wrap gap-2">
            <v-text-field
              :loading="loading"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search"
              placeholder="Search"
              variant="outlined"
              width="150"
              class="my-2"
              hide-details
              v-model="search"
              single-line
            ></v-text-field>
            
            <!-- Filter by Genre -->
            <v-autocomplete
              v-model="genreFilter"
              :items="sortedGenres"
              item-title="title"
              item-value="id"
              label="Filter by Genre"
              density="compact"
              variant="outlined"
              class="my-2"
              hide-details
              clearable
              width="150"
            ></v-autocomplete>
            
            <!-- Filter by Release Year -->
            <v-select
              v-model="yearFilter"
              :items="releaseYears"
              label="Filter by Year"
              density="compact"
              variant="outlined"
              class="my-2"
              hide-details
              clearable
              width="150"
            ></v-select>
            
            <!-- Filter by Rating -->
            <v-select
              v-model="ratingFilter"
              :items="[1, 2, 3, 4, 5]"
              label="Filter by Rating"
              density="compact"
              variant="outlined"
              class="my-2"
              hide-details
              clearable
              width="150"
            ></v-select>
            
            <!-- Reset filters button -->
            <v-btn
              color="primary"
              variant="text"
              class="my-2"
              @click="resetFilters"
              :disabled="!filtersActive"
            >
              <v-icon>mdi-filter-remove</v-icon>
              Reset Filters
            </v-btn>
          </div>
        </div>
      </v-card-title>
      <v-data-table
        :style="{ backgroundColor: theme.global.name.value === 'customLight' ? 'white' : null }"
        :headers="[
          { title: 'No.', align: 'start', sortable: false, key: 'index' },
          { title: 'Title', align: 'start', sortable: true, key: 'title' },
          {
            title: 'Genres',
            align: 'start',
            sortable: true,
            key: 'genre_relation',
          },
          {
            title: 'Release Year',
            align: 'start',
            sortable: true,
            key: 'release_year',
          },
          {
            title: 'Duration/Episodes',
            align: 'start',
            sortable: true,
            key: 'duration',
          },
          // {
          //   title: 'Episodes',
          //   align: 'start',
          //   sortable: true,
          //   key: 'episode',
          // },
          { title: 'Rating', align: 'start', sortable: true, key: 'rating' },
          { title: 'Creator', align: 'start', sortable: true, key: 'creator' },
          {
            title: 'Created By',
            align: 'start',
            sortable: true,
            key: 'createdBy',
          },
          {
            title: 'Created Date',
            align: 'start',
            sortable: true,
            key: 'created_at',
          },
          {
            title: 'Updated Date',
            align: 'start',
            sortable: true,
            key: 'updated_at',
          },
          {
            title: 'Archived Date',
            align: 'start',
            sortable: true,
            key: 'archived_at',
          },
          { title: 'Actions', align: 'start', sortable: false, key: 'actions' },
        ]"
        :search="search"
        :items="filteredMovies"
        :loading="loading"
        :items-per-page="10"
        v-model="selectedFilms"
        show-select
      >
        <!-- Row Numbering -->
        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:item.createdBy="{ item }">
          {{ item.createdBy.name }}
        </template>

        <template v-slot:item.duration="{ item }">
          {{ item.typeMov === 'movie' && item.duration ? `${item.duration} minutes` 
          : item.typeMov === 'series' && item.episode ? `${item.episode} episodes` : 'No Data' }}
        </template>

        <template v-slot:item.genre_relation="{ item }">
          {{
            item.genres_relations
              .map((relation) => relation.genre.title)
              .join(", ")
          }}
        </template>

        <!-- Date Formatting -->
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template v-slot:item.updated_at="{ item }">
          {{ formatDate(item.updated_at) }}
        </template>
        <template v-slot:item.archived_at="{ item }">
          <span :class="item.archived_at ? 'text-error' : null">{{ item.archived_at ? formatDate(item.archived_at) : "-" }}</span>
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <v-menu location="start" offset-y>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-btn class="ma-1" icon @click="viewMovie(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn class="ma-1" icon @click="navigateTo(`/admin/movie/cast/relation/${item.id}`)">
              <v-icon>mdi-relation-one-to-many</v-icon>
            </v-btn>
            <v-btn class="ma-1" icon @click="editMovie(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="item.archived_at === null"
              class="ma-1"
              icon
              @click="archiveMovie(item.id)"
              color="secondary"
            >
              <Icon name="material-symbols-light:archive-outline" size="30" />
            </v-btn>
            <v-btn
              v-else
              class="ma-1"
              icon
              @click="restoreMovie(item.id)"
              color="success"
            >
              <v-icon>mdi-restore</v-icon>
            </v-btn>
            <v-btn
            class="ma-1"
            icon
            @click="areYouSure = true"
            color="error">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          </v-menu>
          <v-dialog v-model="areYouSure">
              <v-card
                width="100%"
                max-width="500px"
                class="d-flex mx-auto my-auto"
              >
                <v-card-title class="d-flex align-center">
                  <v-icon class="mr-2">mdi-alert</v-icon>
                  <h2 class="text-wrap">Are you sure?</h2>
                </v-card-title>
                <v-card-text class="pt-0">
                  <p>Are you sure you want to delete this genre?</p>
                  <div class="mt-3">
                    <v-btn
                      class="mr-3"
                      color="error"
                      @click="deleteMovie(item.id)"
                      >Yes</v-btn
                    >
                    <v-btn @click="areYouSure = false">No</v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit Movie Dialog -->
    <v-dialog @after-leave="formNull" v-model="editMovieDialog">
      <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-pencil</v-icon>
          <h2 class="text-wrap">Edit Movie</h2>
        </v-card-title>
        <v-card-text>
          <v-form v-model="editForm" @submit.prevent="updateMovie">
            <v-text-field
              v-model="title"
              label="Title"
              required
              variant="outlined"
            ></v-text-field>
            <v-select
              v-model="movieType"
              :items="['movie', 'series']"
              label="Movie Type"
              required
              variant="outlined"
            ></v-select>
            <v-textarea
              v-model="description"
              label="Description"
              variant="outlined"
            ></v-textarea>
            <v-text-field
              v-model="releaseYear"
              label="Release Year"
              type="number"
              required
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-if="movieType === 'movie'"
              v-model="duration"
              label="Duration (minutes)"
              type="number"
              required
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-if="movieType === 'series'"
              v-model="episode"
              type="number"
              label="Episode"
              variant="outlined"
            ></v-text-field>
            <v-select
              v-model="rating"
              :items="movieType === 'movie' ? movieRate : seriesRate"
              label="Rating"
              required
              variant="outlined"
            ></v-select>
            <v-text-field
              v-model="creator"
              label="Creator"
              required
              variant="outlined"
            ></v-text-field>
            <v-file-input
              @input="handlePosterInput"
              v-model="poster"
              label="Poster"
              accept="image/*"
              variant="outlined"
            ></v-file-input>
            <v-file-input
              @input="handleTrailerInput"
              v-model="trailer"
              label="Trailer (File)"
              accept="video/*"
              variant="outlined"
            ></v-file-input>
            <v-text-field
              v-model="trailerUrl"
              label="Trailer URL"
              variant="outlined"
            ></v-text-field>
            <v-autocomplete
              v-model="genreIds"
              :items="sortedGenres"
              item-title="title"
              item-value="id"
              label="Genres"
              multiple
              variant="outlined"
              chips
              closable-chips
            ></v-autocomplete>
            <v-btn type="submit" color="primary">Update Movie</v-btn>
            <v-btn @click="formNull" class="ml-2">Cancel</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>