<script setup>
import { ref, onMounted } from 'vue'

const { $moment } = useNuxtApp()
const { data } = useAuth()
const isAdmin = computed(() => data.value?.user?.role === 'admin')
const showToast = inject('showToast')
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
    window.location.reload()
}

const deleteUser = async (id) => {
   try {
      const response = await fetch(`/api/user/delete/${id}`, {
         method: 'PATCH',
      })

      if (!response.ok) {
         throw new Error('Failed to delete genre')
      }

      showToast('Genre updated successfully', 'success')
      window.location.reload()
   } catch (error) {
      console.error('Error updating genre:', error)
      showToast('Error updating genre', 'error')
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
      window.location.reload()
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
      window.location.reload()
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
         throw new Error('Failed to restore genre')
      }
      showToast('Genre restored successfully', 'success')
      window.location.reload()
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
    // Prepare the request body
    const requestBody = {
        name: editName.value,
        email: editEmail.value,
        role: editRole.value,
    }

    // Only include the password if it's not empty
    if (editPass.value) {
        requestBody.password = editPass.value
    }

    // Send the request
    const { data, error } = await useFetch(`/api/user/update/${editId.value}`, {
        method: "PATCH",
        body: requestBody,
    })

    // Handle errors
    if (error.value) {
        showToast(error.value.statusMessage, 'error')
        return
    }

    // Show success message and reload the page
    showToast(data.value.message)
    editItemDialog.value = false
    window.location.reload()
}

onMounted(() => { 
    if (!isAdmin.value) {
        showToast('Access denied', 'error')
        setTimeout(() => {
            window.location.href = '/'
        }, 1000)
    }
})

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
        const response = await fetch('/api/user/manageUser')
        loading.value = false
        if (!response.ok) {
            throw new Error('Failed to fetch genres')
        }
        const data = await response.json()
        console.log("Fetched Data:", data)
        users.value = data || []
    } catch (error) {
        console.error("Error fetching genres:", error)
    }
}

onMounted(() => {
    fetchUsers()
})  
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
      <v-card color="white" elevation="4">
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
         style="background-color: transparent;"
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
            <v-btn class="ma-1" icon @click="editItem(item)">
               <v-icon>mdi-pencil</v-icon>
               <v-dialog v-model="editItemDialog">
                  <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
                     <v-card-title class="d-flex align-center">
                        <v-icon class="mr-2">mdi-pencil</v-icon>
                        <h2 class="text-wrap">Edit Genre</h2>
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
                           <v-btn type="submit" color="primary">Update Genre</v-btn>
                        </v-form>
                     </v-card-text>
                  </v-card>
               </v-dialog>
            </v-btn>
            <v-btn v-if="item.isActive === true" @click="banUser(item.id)" icon color="secondary">
               <v-icon>mdi-cancel</v-icon>
            </v-btn>
            <v-btn icon v-else @click="unbanUser(item.id)" color="success">
               <v-icon>mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn v-if="item.deleted_at === null" class="ma-1" icon @click="areYouSure = true" color="error">
               <v-icon>mdi-delete</v-icon>
               <v-dialog v-model="areYouSure">
                  <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
                     <v-card-title class="d-flex align-center">
                        <v-icon class="mr-2">mdi-alert</v-icon>
                        <h2 class="text-wrap">Are you sure?</h2>
                     </v-card-title>
                     <v-card-text class="pt-0">
                        <p>Are you sure you want to delete this genre?</p>
                        <div class="mt-3">
                           <v-btn class="mr-3" color="error" @click="deleteUser(item.id)">Yes</v-btn>
                           <v-btn @click="areYouSure = false">No</v-btn>
                        </div>
                     </v-card-text>
                  </v-card>
               </v-dialog>
            </v-btn>
            <v-btn v-else class="ma-1" icon @click="restoreItem(item.id)" color="success">
               <v-icon>mdi-restore</v-icon>
            </v-btn>
         </template>
         </v-data-table>
      </v-card> 
   </v-container>
</template>