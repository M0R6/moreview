<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '#imports'

const genres = ref([])

const fetchGenres = async () => {
    try {
        const response = await fetch('/api/genre/getGenre')
        if (!response.ok) {
            throw new Error('Failed to fetch genres')
        }
        const data = await response.json()
        genres.value = data || []
    } catch (error) {
        console.error("Error fetching genres:", error)
    }
}

onMounted(() => {
    fetchGenres()
    fetchUser()
})

const { data, signOut } = useAuth()

const fetchUser = async () => {
    try {
        if (!data.value || !data.value.user) {
            throw new Error('User data is not available')
        }
        const response = await fetch(`/api/user/${data.value.user.id}`)
        if (!response.ok) {
            throw new Error('Failed to fetch user')
        }
        const userData = await response.json()
        user.value = userData
        console.log(user.value) 
    } catch (error) {
        console.error("Error fetching user:", error)
    }
}

const drawer = ref(null)
const adminBar = ref(null)
const genre = ref(null)
const dialogSignOut = ref(false)
const user = ref([])

</script>

<template>
    <v-navigation-drawer theme="customLight" :elevation="12" v-model="drawer">

        <v-list v-if="data" nav>
            <v-menu activator="parent">
              <v-list>
                <v-list-item prepend-icon="mdi-account-edit-outline" :to="`/profile/${data.user.id}`">
                  <v-list-item-title>Edit Profile</v-list-item-title>   
                </v-list-item>
              </v-list>
            </v-menu>
            <v-list-item>
                <template v-slot:prepend>
                    <v-avatar color="secondary">
                        {{ user.name && user.name.split(' ').length > 1 ? user.name.split(' ')[0].charAt(0) + user.name.split(' ').slice(-1)[0].charAt(0) : user.name ? user.name.charAt(0) : '' }}
                    </v-avatar>
                </template>
                <v-list-item-title>
                    <span class="text-wrap font-weight-bold">{{ user.name + ' ' }}</span>
                    <span class="text-wrap">{{ user.role === 'admin' ? '(Admin)' : null }}</span> <br>
                    <span class="text-wrap">{{ user.email }}</span>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list v-else nav>
            <v-list-item to="/auth/login">
                <template v-slot:prepend>
                    <v-avatar color="secondary">
                      <v-icon icon="mdi-account-circle"></v-icon>
                    </v-avatar>
                </template>
                <v-list-item-title>
                    <span class="text-wrap">Login or Register</span>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
            <v-list-item prepend-icon="mdi-home" :to="data?.user ? '/' : '#'" nuxt>
                <template v-slot:title>
                    <span class="font-weight-bold">Home</span>
                </template>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list v-if="user?.role === 'admin'" nav>
            <v-list-item @click="adminBar = !adminBar" prepend-icon="mdi-shield-crown-outline" :append-icon="adminBar ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'">
                <template v-slot:title>
                    <span class="font-weight-bold text-wrap">Admin Features</span>
                </template>
            </v-list-item>
            <v-card elevation="0" v-if="adminBar" class="align-center">
                <v-list-item prepend-icon="mdi-movie-roll" to="/admin/movie" title="Manage Movie"></v-list-item>
                <v-list-item prepend-icon="mdi-shape-plus" to="/admin/genre" title="Manage Genre"></v-list-item>
                <v-list-item prepend-icon="mdi-account-box-multiple" to="/admin/user" title="Manage User"></v-list-item>
            </v-card>
        </v-list>

        <v-divider></v-divider>

        <v-list nav class="overflow-y-auto" max-height="450px">
            <v-list-item prepend-icon="mdi-shape-plus" :append-icon="genre ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'" @click="genre = !genre">
                <template v-slot:title>
                    <span class="font-weight-bold">Genre</span>
                </template>
            </v-list-item>
            <v-card elevation="0" v-if="genre" class="align-center">
                <v-list-item 
                    v-for="(genre, index) in genres" 
                    :key="index"
                    :to="`/genre/${genre.id}`">
                    <template v-slot:title>
                        <span class="text-wrap">{{ genre.title }}</span>
                    </template>
                </v-list-item>
            </v-card>
        </v-list>

        <v-divider></v-divider>

        <v-card color="error" class="ma-3" elevation="0">
            <v-dialog v-model="dialogSignOut">
                <v-card class="d-flex mx-auto" max-width="100%" width="400px">
                    <v-card-title>Sign Out</v-card-title>
                    <v-card-text>Are you sure you want to sign out?</v-card-text>
                    <v-card-actions>
                        <v-btn @click="dialogSignOut = false">Cancel</v-btn>
                        <v-btn @click="signOut({ callbackUrl: '/auth/login' })">Sign Out</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-list v-if="data?.user?.name" nav>
                <v-list-item prepend-icon="mdi-logout-variant" @click="dialogSignOut = true" title="Sign out"></v-list-item>
            </v-list>
        </v-card>
    </v-navigation-drawer>


    <v-app-bar elevation="0" color="white">
      <div class="d-flex w-100 justify-space-between align-center">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="d-flex">
            <img src="~/assets/img/logoku.png" width="50px">
            <h2 class="font-bold align-center d-flex ml-2">Moreview</h2>
        </div>
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-icon 
              class="d-flex my-auto mr-3 cursor-pointer"
              @click="drawer = !drawer" 
              v-bind="props" 
              :color="isHovering ? 'primary' : undefined" 
              size="28" 
              icon="mdi-magnify"
              >
            </v-icon>
          </template>
        </v-hover>
      </div>
    </v-app-bar>
</template>