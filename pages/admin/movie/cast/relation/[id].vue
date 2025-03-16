<script setup>
import { ref, onMounted, inject, computed } from "vue";
import { useHead } from "#imports";
import { useRoute } from "vue-router";

const theme = inject("theme");
const route = useRoute();

useHead({
  title: "Manage Movies - Moreview",
  meta: [
    { name: "description", content: "Admin manage movies on Moreview" },
    { name: "keywords", content: "Moreview, Manage movies, movies, Account" },
  ],
});

const { $moment } = useNuxtApp();

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
        navigateTo("/");
      }, 1000);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};
const showToast = inject("showToast");

const castRelation = ref([{}]);
const loading = ref(false);
const search = ref("");

const getCastRelation = async () => {
  try {
    const response = await fetch(`/api/cast/relation/${route.params.id}`);
    loading.value = true;
    if (!response.ok) {
      throw new Error("Failed to fetch cast relation");
    }

    loading.value = false;
    const castRelationData = await response.json();
    castRelation.value = castRelationData;
    console.log(castRelation.value);
  } catch (error) {
    console.error("Error fetching cast relation:", error);
    loading.value = false;
  }
};

const addCastRelation = async () => {
  try {
    const { data, error } = await useFetch("/api/cast/addRelation", {
      method: "POST",
      body: {
        film_id: route.params.id,
        cast_id: selectedCast.value,
        character_name: characterName.value,
        createdBy: userA.value.id,
      },
    });

    if (error.value) {
      throw new Error(
        error.value.statusMessage || "Failed to add cast relation"
      );
    }

    console.log("Added Cast Relation:", data.value);
    selectedCast.value = "";
    characterName.value = "";
    dialogAdd.value = false;
    getCastRelation();
    showToast("Cast relation added successfully", "success");
  } catch (error) {
    console.error("Error adding cast relation:", error);
    showToast(error.message || "Failed to add cast relation", "error");
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

const castList = ref([]);
const selectedCast = ref("");
const characterName = ref("");
const dialogAdd = ref(false);
const areYouSure = ref(false);

const deleteCastRel = async (id) => {
  try {
    const response = await fetch(`/api/cast/relation/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }

    showToast("Movie deleted successfully", "success");
    areYouSure.value = false;
    getCastRelation();
  } catch (error) {
    console.error("Error deleting movie:", error);
    showToast("Error deleting movie", "error");
  }
};

const dialogEdit = ref(false);
const idCastRel = ref("");
const editCastRel = (castRel) => {
  dialogEdit.value = true;
  idCastRel.value = castRel.id;
  selectedCast.value = castRel.cast_id;
  characterName.value = castRel.character_name;
};

const editCastRelation = async () => {
  try {
    const { data, error } = await useFetch(`/api/cast/relation/update/${idCastRel.value}`, {
      method: "PATCH",
      body: {
        character_name: characterName.value,
      },
    });

    if (error.value) {
      throw new Error(
        error.value.statusMessage || "Failed to edit cast relation"
      );
    }

    console.log("Edited Cast Relation:", data.value);
    selectedCast.value = "";
    characterName.value = "";
    dialogEdit.value = false;
    getCastRelation();
    showToast("Cast relation edited successfully", "success");
  } catch (error) {
    console.error("Error editing cast relation:", error);
    showToast(error.message || "Failed to edit cast relation", "error");
  }
};

const addNull = () => {
  selectedCast.value = "";
  characterName.value = "";
};

const selectedCastRel = ref([]);
const bulkDeleteDialog = ref(false);

const deleteselectedCastRel = async () => {
  if (selectedCastRel.value.length === 0) {
    showToast("No Genres selected", "warning");
    return;
  }

  try {
    const response = await fetch("/api/cast/relation/delete/bulk", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedCastRel.value }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete Genres");
    }

    showToast("Genres deleted successfully", "success");
    selectedCastRel.value = []; // Clear selection
    bulkDeleteDialog.value = false;
    getCastRelation(); // Refresh the list
  } catch (error) {
    console.error("Error deleting Genres:", error);
    showToast("Error deleting Genres", "error");
  }
};

onMounted(async () => {
  await getAuthUser();
  await fetchCasts();
  await getCastRelation();
});
</script>

<template>
  <v-container v-if="isAdmin">

    <v-dialog v-model="bulkDeleteDialog">
       <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
       <v-card-title>Are you sure?</v-card-title>
       <v-card-text>
          Are you sure you want to delete <strong>{{ selectedCastRel.length }}</strong> selected users? <br> <span class="text-error font-weight-bold">all data created by these selected users will be deleted.</span>
       </v-card-text>
       <v-card-actions>
          <v-btn color="error" @click="deleteselectedCastRel">Yes</v-btn>
          <v-btn @click="bulkDeleteDialog = false">No</v-btn>
       </v-card-actions>
       </v-card>
    </v-dialog>

    <!-- Add Cast Relation Dialog -->
    <v-dialog @after-leave="addNull" class="d-flex" height="100%" width="100%" v-model="dialogAdd">
      <v-card
        class="d-flex pa-6 mx-auto my-auto"
        max-height="250px"
        height="100%"
        max-width="500px"
        width="100%"
      >
        <v-form @submit.prevent="addCastRelation">
          <v-autocomplete
            variant="outlined"
            v-model="selectedCast"
            :items="castList"
            item-title="name"
            item-value="id"
            label="Select Cast"
          >
            <!-- Custom item template -->
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar v-if="item.raw.photo">
                    <v-img :src="item.raw.photo" alt="Cast Photo"></v-img>
                  </v-avatar>
                  <v-avatar color="secondary" v-else>
                    {{ item.raw.name.charAt(0) }}
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
            <template #no-data>
              No cast found,
              <span
                class="text-blue text-decoration-underline cursor-pointer"
                @click="navigateTo('/admin/cast')"
                >add cast first</span
              >
            </template>
          </v-autocomplete>
          <v-text-field
            variant="outlined"
            v-model="characterName"
            label="Character Name"
          ></v-text-field>
          <v-btn type="submit" color="primary">Assign</v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEdit">
      <v-card
        class="d-flex pa-6 mx-auto my-auto"
        max-height="250px"
        height="100%"
        max-width="500px"
        width="100%"
      >
        <v-form @submit.prevent="editCastRelation">
          <v-autocomplete
            variant="outlined"
            v-model="selectedCast"
            readonly
            :items="castList"
            item-title="name"
            item-value="id"
            label="Cast"
          >
            <!-- Custom item template -->
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar v-if="item.raw.photo">
                    <v-img :src="item.raw.photo" alt="Cast Photo"></v-img>
                  </v-avatar>
                  <v-avatar color="secondary" v-else>
                    {{ item.raw.name.charAt(0) }}
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
            <template #no-data>
              No cast found,
              <span
                class="text-blue text-decoration-underline cursor-pointer"
                @click="navigateTo('/admin/cast')"
                >add cast first</span
              >
            </template>
          </v-autocomplete>
          <v-text-field
            variant="outlined"
            v-model="characterName"
            label="Character Name"
          ></v-text-field>
          <v-btn type="submit" color="primary">Assign</v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="areYouSure">
      <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
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
              @click="deleteCastRel(selectedCastRel.id)"
              >Yes</v-btn
            >
            <v-btn @click="areYouSure = false">No</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Movie Table -->
    <v-card elevation="4" :color="theme.global.name.value === 'customLight' ? 'white' : null">
      <v-card-title class="d-flex justify-space-between flex-wrap">
        <div class="d-flex flex-wrap">
          <div class="d-flex align-center" width="100%">
            <h2 class="mr-2">Cast Relation</h2>
            <v-chip color="primary">{{ castRelation.length }}</v-chip>
          </div>
          <div class="align-center d-flex mt-2 mt-md-0 ml-0 ml-md-5">
            <v-btn
              color="primary"
              icon="mdi-plus"
              @click="dialogAdd = true"
            ></v-btn>
          </div>
        </div>
        <div>
          <v-btn 
             color="error" 
             class="mt-3" 
             :disabled="selectedCastRel.length === 0"
             v-if="selectedCastRel.length > 0"
             @click="bulkDeleteDialog = true"
          >
             <v-icon left>mdi-delete</v-icon> Delete Selected ({{ selectedCastRel.length }})
          </v-btn>
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
        :style="{ backgroundColor: theme.global.name.value === 'customLight' ? 'white' : null }"
        :headers="[
          { title: 'No.', align: 'start', sortable: false, key: 'index' },
          {
            title: 'Cast Name',
            align: 'start',
            sortable: false,
            key: 'cast.name',
          },
          {
            title: 'Character Name',
            align: 'start',
            sortable: false,
            key: 'character_name',
          },
          {
            title: 'Created By',
            align: 'start',
            sortable: false,
            key: 'created_by.name',
          },
          {
            title: 'Created At',
            align: 'start',
            sortable: false,
            key: 'created_at',
          },
          {
            title: 'Updated At',
            align: 'start',
            sortable: false,
            key: 'updated_at',
          },
          {
            title: 'Archived At',
            align: 'start',
            sortable: false,
            key: 'archived_at',
          },
          { title: 'Actions', align: 'start', sortable: false, key: 'actions' },
        ]"
        :search="search"
        :items="castRelation"
        :loading="loading"
        :items-per-page="10"
        show-select
        v-model="selectedCastRel"
      >
        <!-- Row Numbering -->
        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>

        <!-- <template v-slot:item.created_by="{ item }">
          {{ item.created_by.name }}
        </template> -->

        <!-- Date Formatting -->
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template v-slot:item.updated_at="{ item }">
          {{ formatDate(item.updated_at) }}
        </template>
        <template v-slot:item.archived_at="{ item }">
          {{ item.archived_at ? formatDate(item.archived_at) : "-" }}
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <v-menu location="start" offset-y>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-btn @click="editCastRel(item)" class="ma-1" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              class="ma-1"
              icon
              @click="
                selectedCastRel = item;
                areYouSure = true;
              "
              color="error"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
