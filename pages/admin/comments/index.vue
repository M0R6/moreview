<template>
  <v-container v-if="isAdmin">

    <v-dialog v-model="bulkDeleteDialog">
      <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text>
          Are you sure you want to delete <strong>{{ selectedComments.length }}</strong> selected items?
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteSelectedComments">Yes</v-btn>
          <v-btn @click="bulkDeleteDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="areYouSure">
      <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-alert</v-icon>
          <h2 class="text-wrap">Are you sure?</h2>
        </v-card-title>
        <v-card-text class="pt-0">
          <p>
            Are you sure you want to delete this comment by
            <span class="text-error">{{ selectedItem.user.name }}</span>?
          </p>
          <div class="mt-3">
            <v-btn class="mr-3" color="error" @click="deleteComment(selectedItem.id)">Yes</v-btn>
            <v-btn @click="areYouSure = false">No</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editItemDialog">
      <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-pencil</v-icon>
          <h2 class="text-wrap">Edit Genre</h2>
        </v-card-title>
        <v-card-text>
          <v-form v-model="editForm" @keydown.enter="updateComment" @submit.prevent="updateComment">
            <div>
              <v-textarea v-model="editComment" label="Comment" required variant="outlined"></v-textarea>
              <v-rating hover :model-value="editRating" v-model="editRating" :length="5" :size="24" active-color="primary"
                empty-icon="mdi-heart-outline" half-icon="mdi-heart-half-full" full-icon="mdi-heart" class="mb-4" />
            </div>
            <v-btn type="submit" color="primary">Update Comment</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-card elevation="4" :color="theme.global.name.value === 'customLight' ? 'white' : null">
      <v-card-title class="d-flex justify-space-between flex-wrap">
        <div class="d-flex flex-wrap">
          <div class="d-flex align-center" width="100%">
            <h2 class="mr-2">Comments</h2>
            <v-chip color="primary">{{ comments.length }}</v-chip>
          </div>
        </div>
        <div>
          <v-btn
            color="error"
            class="mt-3"
            :disabled="selectedComments.length === 0"
            v-if="selectedComments.length > 0"
            @click="bulkDeleteDialog = true"
          >
            <v-icon left>mdi-delete</v-icon> Delete Selected ({{
              selectedComments.length
            }})
          </v-btn>
          <v-text-field :loading="loading" append-inner-icon="mdi-magnify" density="compact" label="Search"
            placeholder="Search" variant="outlined" width="300" class="my-2" hide-details v-model="search"
            single-line></v-text-field>
        </div>
      </v-card-title>
      <v-data-table :style="{
          backgroundColor:
            theme.global.name.value === 'customLight' ? 'white' : null,
        }" :headers="[
          { title: 'No.', align: 'start', sortable: false, key: 'index' },
          { title: 'Film', align: 'start', sortable: true, key: 'film.title' },
          { title: 'User', align: 'start', sortable: true, key: 'user.name' },
          { title: 'Comment', align: 'start', sortable: true, key: 'comment' },
          { title: 'Rating', align: 'start', sortable: true, key: 'rating' },
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
          { title: 'Actions', align: 'start', sortable: false, key: 'actions' },
        ]" :search="search" :items="comments" :loading="loading" show-select v-model="selectedComments">
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

        <template v-slot:item.rating="{ item }">
          <v-rating :model-value="item.rating" readonly :length="5" :size="24" active-color="primary"
            empty-icon="mdi-heart-outline" half-icon="mdi-heart-half-full" full-icon="mdi-heart"></v-rating>
        </template>
        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <v-menu location="start" offset-y>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-btn class="ma-1" icon @click="editItem(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn class="ma-1" icon @click="
              areYouSure = true;
              selectedItem = item;
            " color="error">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useHead } from "#imports";

useHead({
  title: "Manage Genre - Moreview",
  meta: [
    { name: "description", content: "Admin manage genre on Moreview" },
    { name: "keywords", content: "Moreview, Manage genre, genre, Account" },
  ],
});

const { $moment } = useNuxtApp();
const theme = inject("theme");
const { data } = useAuth();

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
        navigateTo("/");
      }, 1000);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const comments = ref([]);
const loading = ref(true);
const search = ref("");

const fetchComments = async () => {
  try {
    const response = await fetch("/api/comment/getcomments");
    loading.value = false;
    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }
    const data = await response.json();
    console.log("Fetched Data:", data);
    comments.value = data || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
};

const showToast = inject("showToast");
const areYouSure = ref(false);
const editItemDialog = ref(false);
const editRating = ref(0);
const editComment = ref("");
const selectedItemId = ref("");
const editForm = ref(false);

const editItem = (item) => {
  editItemDialog.value = true;
  editComment.value = item.comment;
  editRating.value = item.rating;
  selectedItemId.value = item.id;
};

const updateComment = async () => {
  try {
    const response = await fetch(`/api/comment/update/${selectedItemId.value}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: editComment.value,
        rating: editRating.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update comment");
    }

    const data = await response.json();
    console.log("Updated Comment:", data);

    showToast("Comment updated successfully", "success");
    editItemDialog.value = false;
    fetchComments();
  } catch (error) {
    console.error("Error updating comment:", error);
    showToast("Failed to update comment", "error");
  }
};

const deleteComment = async (id) => {
  try {
    const response = await fetch(`/api/comment/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    const data = await response.json();
    console.log("Deleted Comment:", data);

    showToast("Comment deleted successfully", "success");
    fetchComments();
  } catch (error) {
    console.error("Error deleting comment:", error);
    showToast("Failed to delete comment", "error");
  }
};

const selectedComments = ref([]);
const bulkDeleteDialog = ref(false);

const deleteSelectedComments = async () => {
  if (selectedComments.value.length === 0) {
    showToast("No comment selected", "warning");
    return;
  }

  try {
    const response = await fetch("/api/comment/delete/bulk", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedComments.value }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete comments");
    }

    showToast("Comments deleted successfully", "success");
    selectedComments.value = []; // Clear selection
    bulkDeleteDialog.value = false;
    fetchComments(); // Refresh the list
  } catch (error) {
    console.error("Error deleting comments:", error);
    showToast("Error deleting comments", "error");
  }
};

onMounted(() => {
  getAuthUser();
  fetchComments();
});
</script>