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
const name = ref("");
const photo = ref(null);
const form = ref(false);

const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const addCast = async () => {
  try {
    const photoBase64 = photo.value ? await convertFileToBase64(photo.value) : null;

    const { data, error } = await useFetch(`/api/cast/add`, {
      method: "POST",
      body: {
        name: name.value,
        photo: photoBase64,
        createdBy: userA.value.id,
      },
    });

    if (error.value) {
      showToast(error.value.statusMessage, "error");
      return;
    }

    showToast(data.value.message, "success");
    addItem.value = false;
    name.value = "";
    photo.value = null;
    fetchCasts();
  } catch (error) {
    console.error("Error during adding genre:", error);
    showToast("Failed to add genre. Please try again.", "error");
  }
};

const deleteCast = async (id) => {
  try {
    const response = await fetch(`/api/cast/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete genre");
    }

    showToast("Genre deleted successfully", "success");
    areYouSure.value = false;
    fetchCasts();
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
    fetchCasts();
  } catch (error) {
    console.error("Error restoring genre:", error);
    showToast("Error restoring genre", "error");
  }
};

const editItemDialog = ref(false);
const editForm = ref(false);
const editName = ref("");
const editPhoto = ref(null);
const editId = ref(null);

// Function to open the edit dialog and pre-fill the form
const editItem = (item) => {
  editName.value = item.name;
  editId.value = item.id;
  editPhoto.value = item.photo;
  editItemDialog.value = true;
};

// Function to send the update request to the backend
const updateCast = async () => {

  const photoBase64 = editPhoto.value ? await convertFileToBase64(editPhoto.value) : null;

  try {
    const { data, error } = await useFetch(`/api/cast/update/${editId.value}`, {
      method: "PATCH",
      body: {
        name: editName.value,
        photo: photoBase64,
      },
    });

    if (error.value) {
      showToast(error.value.statusMessage, "error");
      return;
    }
    showToast(data.value.message, "success");
    editItemDialog.value = false;
    fetchCasts();
  } catch (error) {
    console.error("Error updating genre:", error);
    showToast("Failed to update genre. Please try again.", "error");
  }
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

const casts = ref([]);
const search = ref("");
const loading = ref(true);
const addItem = ref(false);
const areYouSure = ref(false);
const changePicture = ref(false);

const fetchCasts = async () => {
  try {
    const response = await fetch(`/api/cast/author/${userA.value.id}`);
    loading.value = false;
    if (!response.ok) {
      throw new Error("Failed to fetch casts");
    }
    const data = await response.json();
    console.log("Fetched Data:", data);
    casts.value = data || [];
  } catch (error) {
    console.error("Error fetching casts:", error);
  }
};

onMounted(async () => {
  await getAuthUser(); // Ensure user data is available first
  if (userA.value) {
    await fetchCasts();
  }
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
          <v-form v-model="form" @submit.prevent="addCast">
            <v-text-field
              v-model="name"
              label="Cast Name"
              required
              variant="outlined"
            ></v-text-field>
            <v-file-input
              variant="outlined"
              v-model="photo"
              label="Profile Picture"
              accept="image/*"
            ></v-file-input>
            <v-btn @click="addItem = false">Cancel</v-btn>
            <v-btn type="submit" color="primary">Add Cast</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card elevation="4">
      <v-card-title class="d-flex justify-space-between flex-wrap">
        <div class="d-flex flex-wrap">
          <div class="d-flex align-center" width="100%">
            <h2 class="mr-2">Movie Genres</h2>
            <v-chip color="primary">{{ casts.length }}</v-chip>
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
          { title: 'Name', align: 'start', sortable: true, key: 'name' },
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
            title: 'Created By',
            align: 'start',
            sortable: true,
            key: 'created_by.name',
          },
          { title: 'Actions', align: 'start', sortable: false, key: 'actions' },
        ]"
        :search="search"
        :items="casts"
        :loading="loading"
      >
        <!-- Row Numbering -->
        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>
        <!-- Date Formatting -->
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template v-slot:item.updated_at="{ item }">
          {{ formatDate(item.updated_at) }}
        </template>
        <!-- <template v-slot:item.deleted_at="{ item }">
          {{ item.deleted_at ? formatDate(item.deleted_at) : "-" }}
        </template> -->
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
                  <h2 class="text-wrap">Edit Cast</h2>
                </v-card-title>
                <v-card-text>
                  <v-form v-model="editForm" @submit.prevent="updateCast">
                    <v-text-field
                      v-model="editName"
                      label="Title"
                      required
                      variant="outlined"
                    ></v-text-field>
                    <div class="mb-5">
                      <v-avatar v-if="editPhoto !== null" class="">
                        <v-img :src="editPhoto" />
                      </v-avatar>
                      <v-btn
                        class="ma-1"
                        icon
                        @click="changePicture = true"
                        color="primary"
                      >
                        <v-icon v-if="editPhoto === null">mdi-image-plus-outline</v-icon>
                        <v-icon v-else>mdi-image-edit-outline</v-icon>
                      </v-btn>
                    </div>
                      <v-file-input
                        v-if="changePicture"
                        variant="outlined"
                        v-model="editPhoto"
                        label="Profile Picture"
                        accept="image/*"
                      ></v-file-input>
                    <v-btn type="submit" color="primary">Update Cast</v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-btn>
          <v-btn
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
                  <p>Are you sure you want to delete <span class="font-weight-bold">{{ item.name }}</span>?</p>
                  <div class="mt-3">
                    <v-btn
                      class="mr-3"
                      color="error"
                      @click="deleteCast(item.id)"
                      >Yes</v-btn
                    >
                    <v-btn @click="areYouSure = false">No</v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>