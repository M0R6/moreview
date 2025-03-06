<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-card
          :style="
            movie.poster
              ? {
                  backgroundImage: `url(${movie.poster})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {}
          "
          :color="theme.global.name.value === 'customLight' ? 'white' : null"
          v-if="movie"
          elevation="3"
        >
          <v-row class="movie-details">
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
              <v-card-title
                class="px-0 pb-0 text-h5 text-white font-weight-bold"
              >
                {{ movie.title }}
              </v-card-title>
              <v-card-subtitle class="px-0 text-white">
                {{
                  movie.release_year + " • " + movie.duration + " mins" + " • "
                }}
                {{
                  movie.rating === "PG13"
                    ? "PG-13"
                    : movie.rating === "NC17"
                    ? "NC-17"
                    : movie.rating
                }}
              </v-card-subtitle>
              <v-card-text class="px-0 text-white">
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
              <div
                @click="playTrailer = true"
                class="cursor-pointer d-flex align-center"
              >
                <v-btn icon>
                  <v-icon>mdi-play</v-icon>
                </v-btn>
                <v-card-title class="text-white"> Watch Trailer </v-card-title>
              </div>
            </v-col>
          </v-row>
        </v-card>
        <v-alert v-else type="error"
          >Movie with ID '{{ route.params.id }}' not found.</v-alert
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card
          v-if="data"
          elevation="5"
          class="text-center"
          color="transparent"
        >
          <v-form v-model="form" @submit.prevent="addComment">
            <v-card-title class="text-h6">Give this movie a rate!</v-card-title>
            <v-rating
              hover
              :length="5"
              :size="32"
              :model-value="rating"
              v-model="rating"
              active-color="primary"
              empty-icon="mdi-heart-outline"
              half-icon="mdi-heart-half-full"
              full-icon="mdi-heart"
            />
            <v-textarea
              label="Leave a review"
              rows="3"
              v-model="comment"
              variant="outlined"
            ></v-textarea>
            <v-btn type="submit"> Send </v-btn>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card color="transparent" elevation="5">
          <v-card-title class="text-h6">Comments</v-card-title>
          <v-row>
            <v-col cols="12" md="4">
              <v-list style="background-color: transparent">
                <v-list-item v-for="comment in movie?.comments" :key="comment.id">
                  <v-list-item-title class="d-flex align-center mb-3">
                    <v-avatar>
                      <v-img :src="comment.user.photo" alt="avatar"></v-img>
                    </v-avatar>
                    <span class="ml-3">{{ comment.user.name }}</span>
                  </v-list-item-title>
                  <v-rating
                    :model-value="comment.rating"
                    readonly
                    :length="5"
                    :size="24"
                    active-color="primary"
                    empty-icon="mdi-heart-outline"
                    half-icon="mdi-heart-half-full"
                    full-icon="mdi-heart"
                  >
                  </v-rating>
                  <v-list-item-content>
                    <v-textarea
                      v-model="comment.comment"
                      readonly
                      no-resize
                      rows="4"
                      variant="outlined"
                    ></v-textarea>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="playTrailer">
      <v-card height="100vh">
        <video
          v-if="movie?.trailer"
          :src="movie.trailer"
          controls
          class="w-100 h-100 rounded-lg"
        ></video>
        <iframe
          v-else
          :src="movie?.trailerUrl"
          class="w-100 rounded-lg"
          height="400"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, inject } from "vue";
import { useAuth } from "#imports";

const theme = inject("theme");
const { data } = useAuth();
const route = useRoute();
const movie = ref(null);
const error = ref(null);
const form = ref(false);

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

const rating = ref("");
const comment = ref("");
const showToast = inject("showToast");

const addComment = async () => {
  try {
    const { data: responseData, error } = await useFetch(`/api/comment/add`, {
      method: "POST",
      body: {
        comment: comment.value,
        rating: rating.value,
        user_id: data.value.user.id,
        film_id: movie.value.id,
      },
    });

    if (error.value) {
      showToast(error.value.statusMessage, "error");
      return;
    }

    showToast(responseData.value.message, "success");
  } catch (error) {
    console.error("Error during adding genre:", error);
    showToast("Failed to add genre. Please try again.", "error");
  }
};

const playTrailer = ref(false);

onMounted(() => {
  fetchMovieDetails();
});
</script>

<style scoped>
.v-card {
  padding: 16px;
  color: white;
}
.movie-details {
  background: rgba(0, 0, 0, 0.5);
}
</style>