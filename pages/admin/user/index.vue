<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHead } from '#imports';

useHead({
title: 'Manage User - Moreview',
  meta: [
    { name: 'description', content: 'Admin - Manage User' },
    { name: 'keywords', content: 'Moreview, Manage User, Account' },
  ]
});

const { data } = useAuth()

const userA = ref(null)
const isAdmin = computed(() => userA.value?.role === 'admin')

const getAuthUser = async () => {
    try {
        if (!data.value?.user) {
            throw new Error('User data is not available')
        }

        const response = await fetch(`/api/user/${data.value.user.id}`)
        if (!response.ok) {
            throw new Error('Failed to fetch user')
        }

        const userData = await response.json()
        userA.value = userData

        if (!isAdmin.value) {
            showToast('Access denied', 'error')
            setTimeout(() => {
                navigateTo('/')
            }, 1000)
        }
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}

const { $moment } = useNuxtApp()
const showToast = inject('showToast')
const theme = inject('theme')
const name = ref('')
const email = ref('')
const role = ref('subs')
const password = ref('')
const form = ref(false)
const addDialog = ref(false)

const addUser = async () => {
    const { data, error } = await useFetch(`/api/user/add`, {
        method: "POST",
        body: {
            name: name.value,
            email: email.value,
            role: role.value,
            password: password.value,
        }
    })

    if (error.value) {
        showToast(error.value.statusMessage, 'error')
        return
    }
    showToast(data.value.message)
    fetchUsers()
    addDialog.value = false
}

const deleteUser = async (id) => {
   try {
      const response = await fetch(`/api/user/delete/${id}`, {
         method: 'DELETE',
      })

      if (!response.ok) {
         throw new Error('Failed to delete user')
      }

      showToast('user deleted successfully', 'success')
      fetchUsers()
      areYouSure.value = false
   } catch (error) {
      console.error('Error deleting user:', error)
      showToast('Error deleting user', 'error')
   }
}

const banUser = async (id) => {
   try {
      const response = await fetch(`/api/user/ban/${id}`, {
         method: 'PATCH',
      })

      if (!response.ok) {
         throw new Error('Failed to ban user')
      }

      showToast('User banned successfully', 'success')
      fetchUsers()
   } catch (error) {
      console.error('Error to unban user:', error)
      showToast('Error to unban user:', 'error')
   }
}

const unbanUser = async (id) => {
   try {
      const response = await fetch(`/api/user/unban/${id}`, {
         method: 'PATCH',
      })

      if (!response.ok) {
         throw new Error('Failed to unban user')
      }

      showToast('User unbanned successfully', 'success')
      fetchUsers()
   } catch (error) {
      console.error('Error to unban user', error)
      showToast('Error to unban user', 'error')
   }
}

const restoreItem = async (id) => {
   try {
      const response = await fetch(`/api/user/restore/${id}`, {
         method: 'PATCH',
      })
      if (!response.ok) {
         throw new Error('Failed to restore user')
      }
      showToast('User restored successfully', 'success')
      fetchUsers()
   } catch (error) {
      console.error('Error restoring genre:', error)
      showToast('Error restoring genre', 'error')
   }
}

const editItemDialog = ref(false)
const editForm = ref(false)
const editName = ref('')
const editEmail = ref('')
const editRole = ref('')
const editId = ref(null)
const editPass = ref('')

const editItem = (item) => {
    editName.value = item.name
    editEmail.value = item.email
    editRole.value = item.role
    editId.value = item.id
    editPass.value = ''
    editItemDialog.value = true
}

const updateUser = async () => {
    const requestBody = {
        name: editName.value,
        email: editEmail.value,
        role: editRole.value,
    }

    if (editPass.value) {
        requestBody.password = editPass.value
    }

    const { data, error } = await useFetch(`/api/user/update/${editId.value}`, {
        method: "PATCH",
        body: requestBody,
    })

    if (error.value) {
        showToast(error.value.statusMessage, 'error')
        return
    }

    showToast(data.value.message)
    editItemDialog.value = false
    fetchUsers()
}

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

const users = ref([])
const search = ref('')
const loading = ref(true)
const addItem = ref(false)
const areYouSure = ref(false)

const fetchUsers = async () => {
   try {
      const response = await fetch('/api/user/manageUsers')
      loading.value = false
      if (!response.ok) {
         throw new Error('Failed to fetch users')
      }
      const fetchedData = await response.json()
      console.log("Fetched Data:", fetchedData)
      users.value = fetchedData.filter(user => user.id !== data.value.user.id) || []
    } catch (error) {
        console.error("Error fetching genres:", error)
    }
}

const selectedUsers = ref([]);
const bulkDeleteDialog = ref(false);
const bulkBanDialog = ref(false);

const deleteSelectedUsers = async () => {
  if (selectedUsers.value.length === 0) {
    showToast("No Genres selected", "warning");
    return;
  }

  try {
    const response = await fetch("/api/user/delete/bulk", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedUsers.value }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete Genres");
    }

    showToast("Genres deleted successfully", "success");
    selectedUsers.value = []; // Clear selection
    bulkDeleteDialog.value = false;
    fetchUsers(); // Refresh the list
  } catch (error) {
    console.error("Error deleting Genres:", error);
    showToast("Error deleting Genres", "error");
  }
};

const banSelectedUsers = async () => {
  if (selectedUsers.value.length === 0) {
    showToast("No Genres selected", "warning");
    return;
  }

  try {
    const response = await fetch("/api/user/ban/bulk", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedUsers.value }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to ban users");
    }

    showToast("Users banned successfully", "success");
    selectedUsers.value = []; // Clear selection
    bulkBanDialog.value = false;
    fetchUsers(); // Refresh the list
  } catch (error) {
    console.error("Error banning users:", error);
    showToast("Error banning users", "error");
  }
};

onMounted(() => {
    fetchUsers()
    getAuthUser() 
})  
</script>
<template>
   <v-container v-if="isAdmin">


      <v-dialog v-model="editItemDialog">
         <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
            <v-card-title class="d-flex align-center">
               <v-icon class="mr-2">mdi-pencil</v-icon>
               <h2 class="text-wrap">Edit User</h2>
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
                  <v-select
                     v-model="editRole"
                     :items="['admin', 'author', 'subs']"
                     label="Role"
                     required
                     variant="outlined"
                  ></v-select>
                  <v-text-field
                     v-model="editPass"
                     label="Password"
                     type="password"
                     variant="outlined"
                  ></v-text-field>
                  <v-btn type="submit" color="primary">Update User</v-btn>
                  <v-btn class="ml-2" @click="editItemDialog = false">Cancel</v-btn>
               </v-form>
            </v-card-text>
         </v-card>
      </v-dialog>

      <v-dialog v-model="bulkDeleteDialog">
         <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
         <v-card-title>Are you sure?</v-card-title>
         <v-card-text>
            Are you sure you want to delete <strong>{{ selectedUsers.length }}</strong> selected users? <br> <span class="text-error font-weight-bold">all data created by these selected users will be deleted.</span>
         </v-card-text>
         <v-card-actions>
            <v-btn color="error" @click="deleteSelectedUsers">Yes</v-btn>
            <v-btn @click="bulkDeleteDialog = false">No</v-btn>
         </v-card-actions>
         </v-card>
      </v-dialog>

      <v-dialog v-model="bulkBanDialog">
         <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
         <v-card-title>Are you sure?</v-card-title>
         <v-card-text>
            Are you sure you want to ban <strong>{{ selectedUsers.length }}</strong> selected items?
         </v-card-text>
         <v-card-actions>
            <v-btn color="secondary" @click="banSelectedUsers">Yes</v-btn>
            <v-btn @click="bulkBanDialog = false">No</v-btn>
         </v-card-actions>
         </v-card>
      </v-dialog>

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
      <v-dialog v-model="addDialog">
         <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
            <v-card-title class="d-flex align-center">
               <v-icon class="mr-2">mdi-plus</v-icon>
               <h2 class="text-wrap">Add User</h2>
            </v-card-title>
            <v-card-text>
               <v-form v-model="form" @submit.prevent="addUser">
                  <v-text-field
                     v-model="name"
                     label="Name"
                     required
                     variant="outlined"
                  ></v-text-field>
                  <v-text-field
                     v-model="email"
                     label="E-mail"
                     required
                     variant="outlined"
                  ></v-text-field>
                  <v-select
                     v-model="role"
                     :items="['admin', 'author', 'subs']"
                     label="Role"
                     required
                     variant="outlined"
                  ></v-select>
                  <v-text-field
                     v-model="password"
                     label="Password"
                     type="password"
                     variant="outlined"
                  ></v-text-field>
                  <v-btn type="submit" color="primary">Add User</v-btn>
               </v-form>
            </v-card-text>
         </v-card>
      </v-dialog>
      <v-card elevation="4" :color="theme.global.name.value === 'customLight' ? 'white' : null">
         <v-card-title class="d-flex justify-space-between flex-wrap">
            <div class="d-flex flex-wrap">
               <div class="d-flex align-center" width="100%">   
                  <h2 class="mr-2">Users</h2>
                  <v-chip color="primary">{{ users.length }}</v-chip>
               </div>
               <div class="align-center d-flex mt-2 mt-md-0 ml-0 ml-md-5">
                  <v-btn color="primary" @click="addDialog = true" icon="mdi-plus"></v-btn>
               </div>
            </div>
            <div>
               <v-btn 
                  color="secondary" 
                  class="mt-3" 
                  :disabled="selectedUsers.length === 0"
                  v-if="selectedUsers.length > 0"
                  @click="bulkBanDialog = true"
               >
                  <v-icon left>mdi-cancel</v-icon> Ban Selected ({{ selectedUsers.length }})
               </v-btn>
               <br>
               <v-btn 
                  color="error" 
                  class="mt-3" 
                  :disabled="selectedUsers.length === 0"
                  v-if="selectedUsers.length > 0"
                  @click="bulkDeleteDialog = true"
               >
                  <v-icon left>mdi-delete</v-icon> Delete Selected ({{ selectedUsers.length }})
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
            { title: 'Name', align: 'start', sortable: false, key: 'name' },
            { title: 'Email', align: 'start', sortable: true, key: 'email' },
            { title: 'Role', align: 'start', sortable: true, key: 'role' },
            { title: 'Status', align: 'start', sortable: true, key: 'isActive' },
            { title: 'Created Date', align: 'start', sortable: true, key: 'created_at' },
            { title: 'Updated Date', align: 'start', sortable: true, key: 'updated_at' },
            { title: 'Deleted Date', align: 'start', sortable: true, key: 'deleted_at' },
            { title: 'Actions', align: 'start', sortable: false, key: 'actions' }
         ]"
         :search="search"
         :items="users"
         :loading="loading"
         v-model="selectedUsers"
         show-select
         >
         <template v-slot:item.index="{ index }">
            {{ index + 1 }}
         </template>
         <template v-slot:item.role="{ item }">
            {{ item.role === 'subs' ? 'Subscriber' : item.role === 'author' ? 'Author' : 'Admin' }}
         </template>
         <template v-slot:item.isActive="{ item }">
            {{ item.isActive === true ? 'Active' : 'Inactive / Banned' }}
         </template>
         <template v-slot:item.created_at="{ item }">
            {{ console.log(item) }}
            {{ formatDate(item.created_at) }}
         </template>
         <template v-slot:item.updated_at="{ item }">
            {{ formatDate(item.updated_at) }}
         </template>
         <template v-slot:item.deleted_at="{ item }">
            {{ item.deleted_at ? formatDate(item.deleted_at) : '-' }}
         </template>
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
            <v-btn v-if="item.isActive === true" @click="banUser(item.id)" icon color="secondary">
               <v-icon>mdi-cancel</v-icon>
            </v-btn>
            <v-btn icon v-else @click="unbanUser(item.id)" color="success">
               <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn v-if="item.deleted_at === null" class="ma-1" icon @click="areYouSure = true; selectedUser = item" color="error">
               <v-icon>mdi-delete</v-icon>
               <v-dialog v-model="areYouSure">
                  <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
                     <v-card-title class="d-flex align-center">
                        <v-icon class="mr-2">mdi-alert</v-icon>
                        <h2 class="text-wrap">Are you sure?</h2>
                     </v-card-title>
                     <v-card-text class="pt-0">
                        <p>Are you sure you want to delete {{ selectedUser.name }}?</p>
                        <div class="mt-3">
                           <v-btn class="mr-3" color="error" @click="deleteUser(selectedUser.id)">Yes</v-btn>
                           <v-btn @click="areYouSure = false">No</v-btn>
                        </div>
                     </v-card-text>
                  </v-card>
               </v-dialog>
            </v-btn>
            <v-btn v-else class="ma-1" icon @click="restoreItem(item.id)" color="success">
               <v-icon>mdi-restore</v-icon>
            </v-btn>
         </v-menu>
         </template>
         </v-data-table>
      </v-card> 
   </v-container>
</template>