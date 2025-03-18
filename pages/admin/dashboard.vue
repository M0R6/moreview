<template>
  <v-container v-if="isAdmin">
    <v-app-bar color="transparent" elevation="0">
      <v-card-item>
        <template v-slot:prepend>
          <v-icon color="primary" size="x-large">mdi-view-dashboard</v-icon>
        </template>
        <v-card-title class="text-h5 font-weight-bold">Dashboard</v-card-title>
      </v-card-item>
    </v-app-bar>
    <v-row>
      <v-col cols="12" md="4">
        <v-card elevation="3" class="rounded-lg">
          
          <v-divider></v-divider>
          
          <v-card-text>
            <div class="d-flex justify-space-between align-center py-4">
              <div class="d-flex flex-column align-center">
                <v-avatar color="primary" size="80" class="elevation-3 mb-4">
                  <v-icon size="50" color="white">mdi-account</v-icon>
                </v-avatar>
                <span class="text-body-1 font-weight-medium text-primary">Users</span>
              </div>
              
              <div class="d-flex align-center">
                <span class="text-h2 font-weight-bold">{{ users.length }}</span>
                <v-chip class="ml-4">
                  Users
                </v-chip>
              </div>
            </div>
          </v-card-text>
          
          <v-card-actions class="rounded-b-lg">
            <v-spacer></v-spacer>
            <v-btn @click="navigateTo('/admin/users')" variant="text" prepend-icon="mdi-cog">
              Manage All
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="3" class="rounded-lg">
          
          <v-divider></v-divider>
          
          <v-card-text>
            <div class="d-flex justify-space-between align-center py-4">
              <div class="d-flex flex-column align-center">
                <v-avatar color="primary" size="80" class="elevation-3 mb-4">
                  <v-icon size="50" color="white">mdi-movie-open</v-icon>
                </v-avatar>
                <span class="text-body-1 font-weight-medium text-primary">Movies</span>
              </div>
              
              <div class="d-flex align-center">
                <span class="text-h2 font-weight-bold">{{ movies.length }}</span>
                <v-chip class="ml-4">
                  Movies
                </v-chip>
              </div>
            </div>
          </v-card-text>
          
          <v-card-actions class="rounded-b-lg">
            <v-spacer></v-spacer>
            <v-btn @click="navigateTo('/admin/movie')" variant="text" prepend-icon="mdi-cog">
              Manage All
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="3" class="rounded-lg">
          
          <v-divider></v-divider>
          
          <v-card-text>
            <div class="d-flex justify-space-between align-center py-4">
              <div class="d-flex flex-column align-center">
                <v-avatar color="primary" size="80" class="elevation-3 mb-4">
                  <v-icon size="50" color="white">mdi-comment-account</v-icon>
                </v-avatar>
                <span class="text-body-1 font-weight-medium text-primary">Comments</span>
              </div>
              
              <div class="d-flex align-center">
                <span class="text-h2 font-weight-bold">{{ comments.length }}</span>
                <v-chip class="ml-4">
                  Comments
                </v-chip>
              </div>
            </div>
          </v-card-text>
          
          <v-card-actions class="rounded-b-lg">
            <v-spacer></v-spacer>
            <v-btn @click="navigateTo('/admin/comments')" variant="text" prepend-icon="mdi-cog">
              Manage All
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-lg">
          
          <v-divider></v-divider>
          
          <v-card-text>
            <div class="d-flex justify-space-between align-center py-4">
              <div class="d-flex flex-column align-center">
                <v-avatar color="primary" size="80" class="elevation-3 mb-4">
                  <v-icon size="50" color="white">mdi-shape-outline</v-icon>
                </v-avatar>
                <span class="text-body-1 font-weight-medium text-primary">Movies by genres</span>
              </div>
              
              <div class="d-flex align-center">
                <v-list>
                  <v-list-item v-for="(count, genre) in genreCounts" :key="genre">
                    <v-list-item-content>
                      <v-list-item-title>{{ genre }}</v-list-item-title>
                      <v-list-item-subtitle>{{ count }} movies</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </div>
          </v-card-text>
          
          <v-card-actions class="rounded-b-lg">
            <v-spacer></v-spacer>
            <v-btn @click="navigateTo('/admin/movie')" variant="text" prepend-icon="mdi-cog">
              Manage All
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useHead, useAuth } from "#imports";
import { ref, computed, inject } from "vue";

const showToast = inject("showToast");
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
      }, 3000);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const movies = ref([]);
const fetchMovies = async () => {
  try {
    const response = await fetch("/api/movie/getMovie");
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

const comments = ref([]);
const fetchComments = async () => {
  try {
    const response = await fetch("/api/comment/getcomments");
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    comments.value = data || [];
    console.log([data]);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

const users = ref([]);
const fetchUsers = async () => {
  try {
    const response = await fetch("/api/user/manageUsers");
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    users.value = data || [];
    console.log([data]);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

onMounted(() => {
  getAuthUser();
  fetchMovies();
  fetchComments();
  fetchUsers();
});

useHead({
  title: "Dashboard - Moreview",
  meta: [
    {
      name: "description",
      content: "Dashboard for Moreview Admins",
    },
    {
      name: "keywords",
      content: "Moreview, Dashboard, Admin",
    },
    {
      name: "author",
      content: "Moreview",
    },
    {
      name: "robots",
      content: "noindex",
    },
  ],
});
</script>