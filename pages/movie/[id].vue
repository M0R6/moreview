<template>
  <v-container>
    <v-dialog v-model="editForm" class="d-flex">
        <v-card
          elevation="5"
          class="text-center mx-auto"
          max-width="650px"
          width="100%"
          :color="theme.global.name.value === 'customLight' ? 'white' : null"
        >
      <v-form v-model="form" @submit.prevent="updateComment">
        <v-card-title class="text-h6">Edit your review!</v-card-title>
        <v-rating
          hover
          :length="5"
          :size="32"
          :model-value="rating"
          v-model="editRating"
          active-color="primary"
          empty-icon="mdi-heart-outline"
          half-icon="mdi-heart-half-full"
          full-icon="mdi-heart"
        />
        <v-textarea
          label="Leave a review"
          rows="3"
          v-model="editCommentData"
          variant="outlined"
          @keydown.enter="updateComment"
        ></v-textarea>
        <v-btn type="submit"> Send </v-btn>
        <v-btn @click="addForm = true; editForm = false"> Cancel </v-btn>
      </v-form>
    </v-card>
    </v-dialog>

    <v-dialog class="d-flex" v-model="deleteDialog">
      <v-card class="mx-auto" width="500px" :color="theme.global.name.value === 'customLight' ? 'white' : null">
        <v-card-title class="text-h6 text-wrap">Are you sure you want to delete this review?</v-card-title>
        <v-card-actions>
          <v-btn @click="deleteDialog = false"> Cancel </v-btn>
          <v-btn @click="deleteComment(idReview); deleteDialog = false"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              <v-card-title class="px-0 py-1 text-subtitle text-white font-weight-semibold">
                Film created by: {{ movie.creator }}
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
                    @click="navigateTo(`/search/${genre.genre.title}`)"
                  >
                    {{ genre.genre.title }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              <div class="mb-4">
                <v-rating
                  :model-value="averageRating"
                  half-increments
                  readonly
                  :length="5"
                  :size="24"
                  color="white"
                  active-color="primary"
                  empty-icon="mdi-heart-outline"
                  half-icon="mdi-heart-half-full"
                  full-icon="mdi-heart"
                >
                </v-rating>
                <br />
                <span class="text-white"
                  >{{ averageRating.toFixed(2) }} / 5 ({{
                    movie.comments.length
                  }}
                  {{ movie.comments.length > 1 ? "reviews" : "review" }})</span
                >
              </div>
              <div
                @click="playTrailer = true"
                class="cursor-pointer d-flex align-center"
              >
                <v-btn color="white" icon>
                  <v-icon>mdi-play</v-icon>
                </v-btn>
                <v-card-title class="text-white"> Watch Trailer </v-card-title>
              </div>
              <v-card
                width="100vh"
                max-width="100%"
                color="transparent"
                elevation="0"
              >
                <v-card-title v-if="movie.film_casts && movie.film_casts.length" class="text-white text-center text-h6"
                  >Top Casts</v-card-title
                >
                <v-slide-group class="d-flex justify-start" align="start">
                    <v-slide-group-item
                    class="d-flex align-center"
                    v-for="cast in movie.film_casts"
                    :key="cast.id"
                    >
                    <v-card color="transparent" elevation="0" width="250px" class="d-flex align-center">
                      <v-avatar v-if="cast.cast.photo" size="80">
                        <v-img
                          :src="cast.cast.photo"
                          width="150"
                          height="200"
                          class="d-flex align-center"
                          cover
                        ></v-img>
                      </v-avatar>
                      <v-avatar v-else color="secondary" size="100">
                        {{
                          cast.cast.name &&
                          cast.cast.name.split(" ").length > 1
                            ? cast.cast.name.split(" ")[0].charAt(0) +
                              cast.cast.name.split(" ").slice(-1)[0].charAt(0)
                            : cast.cast.name
                            ? cast.cast.name.charAt(0)
                            : ""
                        }}
                      </v-avatar>
                      <div class="mx-3 my-auto">
                        <v-card-title class="text-white text-truncate pa-0">{{
                          cast.cast.name  
                        }}</v-card-title>
                        <v-card-subtitle class="text-white text-truncate pa-0">{{
                          cast.character_name
                        }}</v-card-subtitle>
                      </div>
                    </v-card>
                  </v-slide-group-item>
                </v-slide-group>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <v-alert v-else type="error"
          >Movie with ID '{{ route.params.id }}' not found.</v-alert
        >
      </v-col>
    </v-row>
    <v-row v-if="movie">
      <v-col cols="12">
        <v-card
          v-if="data"
          elevation="5"
          class="text-center"
          color="transparent"
        >
          <v-form v-if="addForm" v-model="form" @submit.prevent="addComment">
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
              @keydown.enter="addComment"
            ></v-textarea>
            <v-btn type="submit"> Send </v-btn>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card-title class="text-h6">Comments</v-card-title>
        <v-card
          max-height="500px"
          class="overflow-auto"
          color="transparent"
          elevation="5"
        >
          <v-row>
            <v-col
              v-for="comment in sortedComments"
              :key="comment.id"
              cols="12"
              md="4"
            >
              <v-list style="background-color: transparent">
                <v-list-item>
                  <v-list-item-title class="d-flex align-center mb-3">
                    <v-avatar v-if="comment.user.photo">
                      <v-img :src="comment.user.photo" alt="avatar"></v-img>
                    </v-avatar>
                    <v-avatar v-else color="secondary">
                      {{
                        comment.user.name &&
                        comment.user.name.split(" ").length > 1
                          ? comment.user.name.split(" ")[0].charAt(0) +
                            comment.user.name.split(" ").slice(-1)[0].charAt(0)
                          : comment.user.name
                          ? comment.user.name.charAt(0)
                          : ""
                      }}
                    </v-avatar>
                    <div>
                      <v-card-text class="pa-0 ml-3 text-truncate">{{ comment.user.name }}</v-card-text>
                      <v-card-subtitle class="pa-0 ml-3 text-wrap">{{ comment.user.email }}</v-card-subtitle>
                    </div>
                    <v-chip class="ml-2" v-if="data && comment.user.id === data.user.id">You</v-chip>
                    <v-chip class="ml-2" v-if="comment.user.role === 'admin'">{{ comment.user.role === "admin" ? "Admin" : null }}</v-chip>
                  </v-list-item-title>
                  <div class="d-flex align-center justify-space-between mb-2">
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
                    <div v-if="data && comment.user.id === data.user.id">
                      <v-icon class="cursor-pointer" @click="editComment(comment)">mdi-pencil</v-icon>
                      <v-icon class="cursor-pointer" @click="deleteDialog = true; idReview = comment.id">mdi-delete</v-icon>
                    </div>
                  </div>
                  <div>
                    <v-textarea
                      v-model="comment.comment"
                      readonly
                      no-resize
                      rows="4"
                      variant="outlined"
                      hide-details
                    ></v-textarea>
                  </div>  
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog class="d-flex" v-model="playTrailer">
      <v-card width="100%" max-width="600px" class="mx-auto">
        <video
          v-if="movie?.trailer"
          :src="movie.trailer"
          controls
          class="rounded-lg"
          style="width: 100%; height: auto; max-width: 600px;"
        ></video>
        <iframe
          v-else
          :src="movie?.trailerUrl"
          class="rounded-lg"
          style="width: 100%; height: 315px; max-width: 600px;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style>
.v-slide-group__prev,
.v-slide-group__next {
  display: block !important;
  display: flex !important;
  color: white !important;
}
</style>

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
const averageRating = ref(0);
const sortedComments = computed(() => {
  if (!movie.value || !movie.value.comments) {
    return [];
  }
  if (!data.value) {
    return movie.value.comments.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }
  return movie.value.comments.sort((a, b) => {
    if (a.user.id === data.value.user.id) return -1;
    if (b.user.id === data.value.user.id) return 1;
    return 0;
  });
});

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
    averageRating.value = movie.value.comments.reduce(
      (acc, comment) => acc + comment.rating,
      0
    );
    averageRating.value /= movie.value.comments.length;
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

    comment.value = "";
    rating.value = "";
    showToast(responseData.value.message, "success");
    fetchMovieDetails();
  } catch (error) {
    console.error("Error during adding genre:", error);
    showToast("Failed to add genre. Please try again.", "error");
  }
};

const addForm = ref(true);
const editForm = ref(false);
const editRating = ref("");
const editCommentData = ref("");
const idReview = ref("");

const editComment = (comment) => {
  idReview.value = comment.id;
  editRating.value = comment.rating;
  editCommentData.value = comment.comment;
  addForm.value = false;
  editForm.value = true;
};

const updateComment = async () => {
  try {
    const { data: responseData, error } = await useFetch(
      `/api/comment/update/${idReview.value}`,
      {
        method: "PATCH",
        body: {
          comment: editCommentData.value,
          rating: editRating.value,
        },
      }
    );

    if (error.value) {
      showToast(error.value.statusMessage, "error");
      return;
    }

    editForm.value = false;
    addForm.value = true;
    showToast(responseData.value.message, "success");
    fetchMovieDetails();
  } catch (error) {
    console.error("Error during adding genre:", error);
    showToast("Failed to add genre. Please try again.", "error");
  }
};

const deleteDialog = ref(false);

const deleteComment = async (id) => {
  try {
    const { data: responseData, error } = await useFetch(
      `/api/comment/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    if (error.value) {
      showToast(error.value.statusMessage, "error");
      return;
    }

    showToast(responseData.value.message, "success");
    fetchMovieDetails();
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