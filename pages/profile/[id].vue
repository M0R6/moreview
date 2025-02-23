<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '#imports'

const { data: authData } = useAuth()
const { $moment } = useNuxtApp()

const formatDate = (date) => {
    if (!date) return '-'

    const momentDate = $moment.utc(date).tz('Asia/Jakarta').locale('id')

    if (momentDate.isSame($moment(), 'day')) {
        return `Today at ${momentDate.format('HH:mm:ss')}`
    } else if (momentDate.isSame($moment().subtract(1, 'day'), 'day')) {
        return `Yesterday at ${momentDate.format('HH:mm:ss')}`
    } else {
        return momentDate.format('LLLL')
    }
}

const authenticatedUser = computed(() => authData.value?.user)
const showToast = inject('showToast')

const editItemDialog = ref(false)
const editForm = ref(false)
const editName = ref('')
const editEmail = ref('')
const editId = ref(null)
const editPass = ref('')

// Fetch the user profile
const userProfile = ref(null)
const loading = ref(true)

const fetchUserProfile = async (id) => {
  try {
    const response = await fetch(`/api/user/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }
    const data = await response.json()
    userProfile.value = data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    showToast('Failed to fetch user profile', 'error')
  } finally {
    loading.value = false
  }
}

// Open the edit dialog
const editItem = (item) => {
  if (authenticatedUser.value?.id !== item.id) {
    showToast('Access denied', 'error')
    return
  }

  editName.value = item.name
  editEmail.value = item.email
  editId.value = item.id
  editPass.value = ''
  editItemDialog.value = true
}

const updateUser = async () => {
  const requestBody = {
    name: editName.value,
    email: editEmail.value,
  };

  if (editPass.value) {
    requestBody.password = editPass.value;
  }

  const { data, error } = await useFetch(`/api/user/update/${editId.value}`, {
    method: "PATCH",
    body: requestBody,
  });

  if (error.value) {
    console.error("Update failed:", error.value);
    showToast(error.value.data.error || "An error occurred", "error");
    return;
  }

  showToast(data.value.message, "success");
  editItemDialog.value = false;
  fetchMovies();
};

// Check access on mounted
onMounted(async () => {
  const route = useRoute()
  const { id } = route.params

  // Fetch the user profile
  await fetchUserProfile(id)

  // Check if the authenticated user is accessing their own profile
  if (authenticatedUser.value?.id !== id) {
    showToast('Access denied', 'error')
    setTimeout(() => {
      navigateTo('/')
    }, 1000)
  }
})
</script>

<template>
   <v-container>
     <!-- Loading State -->
     <v-progress-circular class="mx-auto my-auto d-flex" v-if="loading" indeterminate color="primary"></v-progress-circular>
 
     <!-- User Profile -->
     <v-card v-if="userProfile" width="100%" max-width="500px" class="mx-auto my-auto" color="transparent">
       <v-card-title class="d-flex align-center justify-center">
         <v-icon class="mr-2">mdi-account</v-icon>
         <h2 class="text-wrap">User Profile</h2>
       </v-card-title>
       <v-card-text>
         <v-list>
           <v-list-item>
             <v-list-item-title>Name</v-list-item-title>
             <v-list-item-subtitle>{{ userProfile.name }}</v-list-item-subtitle>
           </v-list-item>
           <v-list-item>
             <v-list-item-title>Email</v-list-item-title>
             <v-list-item-subtitle>{{ userProfile.email }}</v-list-item-subtitle>
           </v-list-item>
           <v-list-item>
             <v-list-item-title>Registered at</v-list-item-title>
             <v-list-item-subtitle>{{ formatDate(userProfile.created_at) }}</v-list-item-subtitle>
           </v-list-item>
           <v-list-item>
             <v-list-item-title>Last updated at</v-list-item-title>
             <v-list-item-subtitle>{{ formatDate(userProfile.updated_at) }}</v-list-item-subtitle>
           </v-list-item>
         </v-list>
 
         <!-- Edit Button -->
         <v-btn color="primary" @click="editItem(userProfile)" class="mt-4">
           <v-icon class="mr-2">mdi-pencil</v-icon>
           Edit Profile
         </v-btn>
       </v-card-text>
     </v-card>
 
     <!-- Edit Profile Dialog -->
     <v-dialog v-model="editItemDialog">
       <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
         <v-card-title class="d-flex align-center">
           <v-icon class="mr-2">mdi-pencil</v-icon>
           <h2 class="text-wrap">Edit Profile</h2>
         </v-card-title>
         <v-card-text>
           <v-form v-model="editForm" @submit.prevent="updateUser">
             <v-text-field
               v-model="editName"
               label="Name"
               required
               variant="outlined"
             ></v-text-field>
             <v-text-field
               v-model="editEmail"
               label="E-mail"
               required
               variant="outlined"
             ></v-text-field>
             <v-text-field
               v-model="editPass"
               label="Password"
               type="password"
               variant="outlined"
             ></v-text-field>
             <v-btn class="mr-2" type="submit" color="primary">Update Profile</v-btn>
             <v-btn @click="editItemDialog = false">Cancel</v-btn>
           </v-form>
         </v-card-text>
       </v-card>
     </v-dialog>
   </v-container>
 </template>