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
        <v-card height="100%" elevation="3" class="rounded-lg">
          
          <v-divider></v-divider>
          
          <v-card-text>
            <div class="d-flex justify-space-between align-center py-4">
              <div class="d-flex flex-column align-center">
                <v-avatar color="primary" size="80" class="elevation-3 mb-4">
                  <v-icon size="50" color="white">mdi-shape-outline</v-icon>
                </v-avatar>
                <span class="text-body-1 font-weight-medium text-primary text-center">New Added</span>
              </div>
              
              <div class="d-flex align-center">
                <v-list>
                  <v-list-item v-for="movie in latestMovie" :key="movie.id">
                    <v-list-item-content>
                      <v-list-item-title>{{ movie.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(movie.created_at) }}</v-list-item-subtitle>
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

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Movie Ratings Distribution</v-card-title>
          <v-card-text>
            <canvas ref="chart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useHead, useAuth } from "#imports";
import { ref, computed, inject } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const chart = ref(null);

const ratingDistribution = computed(() => {
  const ratingCounts = Array(5).fill(0);

  // Count movies for each rating
  movies.value.forEach(movie => {
    if (movie.comments && movie.comments.length > 0) {
      const totalRating = movie.comments.reduce((sum, comment) => sum + comment.rating, 0);
      const avgRating = Math.round(totalRating / movie.comments.length);
      
      if (avgRating >= 1 && avgRating <= 5) {
        ratingCounts[avgRating - 1]++;
      }
    }
  });

  return ratingCounts;
});

const showToast = inject("showToast");
const { data } = useAuth();

const { $moment } = useNuxtApp();

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

const movies = ref([]);
const latestMovie = ref([]);
const mostPopular = ref([]);
const fetchMovies = async () => {
  try {
    const response = await fetch("/api/movie/getMovie");
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    movies.value = data || [];
    if (Array.isArray(data) && data.length > 0) {
      latestMovie.value = data
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
      mostPopular.value = data
        .slice()
        .sort((a, b) => b.comments.length - a.comments.length)
        .slice(0, 10);
    }
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

onMounted(async () => {
  await getAuthUser();
  await fetchMovies();
  await fetchComments();
  await fetchUsers();
  new Chart(chart.value, {
    type: "bar",
    data: {
      labels: ["1", "2", "3", "4", "5"],
      datasets: [
        {
          label: "Number of Movies",
          data: ratingDistribution.value,
          backgroundColor: "#42b983",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
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