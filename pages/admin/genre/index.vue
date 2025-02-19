<script setup>
import { ref, onMounted } from "vue";
import { useHead } from "#imports";

useHead({
  title: "Manage Genre - Moreview",
  meta: [
    { name: "description", content: "Admin manage genre on Moreview" },
    { name: "keywords", content: "Moreview, Manage genre, genre, Account" },
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
        window.location.href = "/";
      }, 1000);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const showToast = inject("showToast");
const title = ref("");
const form = ref(false);

const addGenre = async () => {
  const { data, error } = await useFetch(`/api/genre/add`, {
    method: "POST",
    body: {
      title: title.value,
    },
  });

  if (error.value) {
    showToast(error.value.statusMessage, "error");
    return;
  }
  showToast(data.value.message);
  addItem.value = false;
  title.value = "";
  fetchGenres();
};

const deleteGenre = async (id) => {
  try {
    const response = await fetch(`/api/genre/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete genre");
    }

    showToast("Genre deleted successfully", "success");
    areYouSure.value = false;
    fetchGenres();
  } catch (error) {
    console.error("Error deleting genre:", error);
    showToast("Error deleting genre", "error");
  }
};

const restoreItem = async (id) => {
  try {
    const response = await fetch(`/api/genre/restore/${id}`, {
      method: "PATCH",
    });
    if (!response.ok) {
      throw new Error("Failed to restore genre");
    }
    showToast("Genre restored successfully", "success");
    fetchGenres();
  } catch (error) {
    console.error("Error restoring genre:", error);
    showToast("Error restoring genre", "error");
  }
};

const editItemDialog = ref(false);
const editForm = ref(false);
const editTitle = ref("");
const editId = ref(null);

// Function to open the edit dialog and pre-fill the form
const editItem = (item) => {
  editTitle.value = item.title;
  editId.value = item.id;
  editItemDialog.value = true;
};

// Function to send the update request to the backend
const updateGenre = async () => {
  const { data, error } = await useFetch(`/api/genre/update/${editId.value}`, {
    method: "PATCH",
    body: {
      title: editTitle.value,
    },
  });

  if (error.value) {
    showToast(error.value.statusMessage, "error");
    return;
  }
  showToast(data.value.message);
  editItemDialog.value = false;
  fetchGenres();
};

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

const genres = ref([]);
const search = ref("");
const loading = ref(true);
const addItem = ref(false);
const areYouSure = ref(false);

const fetchGenres = async () => {
  try {
    const response = await fetch("/api/genre/manageGenre");
    loading.value = false;
    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }
    const data = await response.json();
    console.log("Fetched Data:", data);
    genres.value = data || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
};

onMounted(() => {
  fetchGenres();
  getAuthUser();
});
</script>
<template>
  <v-container v-if="isAdmin">
    <v-dialog v-model="addItem">
      <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-plus</v-icon>
          <h2 class="text-wrap">Add Genre</h2>
        </v-card-title>
        <v-card-text>
          <v-form v-model="form" @submit.prevent="addGenre">
            <v-text-field
              v-model="title"
              label="Title"
              required
              variant="outlined"
            ></v-text-field>
            <v-btn type="submit" color="primary">Add Genre</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card color="white" elevation="4">
      <v-card-title class="d-flex justify-space-between flex-wrap">
        <div class="d-flex flex-wrap">
          <div class="d-flex align-center" width="100%">
            <h2 class="mr-2">Movie Genres</h2>
            <v-chip color="primary">{{ genres.length }}</v-chip>
          </div>
          <div class="align-center d-flex mt-2 mt-md-0 ml-0 ml-md-5">
            <v-btn
              color="primary"
              @click="addItem = true"
              icon="mdi-plus"
            ></v-btn>
          </div>
        </div>
        <div>
          <v-text-field
            :loading="loading"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search"
            placeholder="Search"
            variant="outlined"
            width="300"
            class="my-2"
            hide-details
            v-model="search"
            single-line
          ></v-text-field>
        </div>
      </v-card-title>
      <v-data-table
        style="background-color: transparent"
        :headers="[
          { title: 'No.', align: 'start', sortable: false, key: 'index' },
          { title: 'Title', align: 'start', sortable: true, key: 'title' },
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
            title: 'Deleted Date',
            align: 'start',
            sortable: true,
            key: 'deleted_at',
          },
          { title: 'Actions', align: 'start', sortable: false, key: 'actions' },
        ]"
        :search="search"
        :items="genres"
        :loading="loading"
      >
        <!-- Row Numbering -->
        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>
        <!-- Date Formatting -->
        <template v-slot:item.created_at="{ item }">
          {{ console.log(item) }}
          {{ formatDate(item.created_at) }}
        </template>
        <template v-slot:item.updated_at="{ item }">
          {{ formatDate(item.updated_at) }}
        </template>
        <template v-slot:item.deleted_at="{ item }">
          {{ item.deleted_at ? formatDate(item.deleted_at) : "-" }}
        </template>
        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <v-btn class="ma-1" icon @click="editItem(item)">
            <v-icon>mdi-pencil</v-icon>
            <v-dialog v-model="editItemDialog">
              <v-card
                width="100%"
                max-width="500px"
                class="d-flex mx-auto my-auto"
              >
                <v-card-title class="d-flex align-center">
                  <v-icon class="mr-2">mdi-pencil</v-icon>
                  <h2 class="text-wrap">Edit Genre</h2>
                </v-card-title>
                <v-card-text>
                  <v-form v-model="editForm" @submit.prevent="updateGenre">
                    <v-text-field
                      v-model="editTitle"
                      label="Title"
                      required
                      variant="outlined"
                    ></v-text-field>
                    <v-btn type="submit" color="primary">Update Genre</v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-btn>
          <v-btn
            v-if="item.deleted_at === null"
            class="ma-1"
            icon
            @click="areYouSure = true"
            color="error"
          >
            <v-icon>mdi-delete</v-icon>
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
                      @click="deleteGenre(item.id)"
                      >Yes</v-btn
                    >
                    <v-btn @click="areYouSure = false">No</v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-btn>
          <v-btn
            v-else
            class="ma-1"
            icon
            @click="restoreItem(item.id)"
            color="success"
          >
            <v-icon>mdi-restore</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>