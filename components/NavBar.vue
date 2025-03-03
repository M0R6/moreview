<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '#imports'
import { inject } from 'vue'

const theme = inject('theme')

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
const dialogSearch = ref(false)
const adminBar = ref(false)
const authorBar = ref(false)
const genre = ref(null)
const dialogSignOut = ref(false)
const user = ref([])
const searchQuery = ref('')

const search = () => {
    const query = searchQuery.value.trim();
    if (!query) return; // Prevents empty searches
    navigateTo(`/search/${encodeURIComponent(query)}`)
};
</script>

<template>
    <v-navigation-drawer :color="theme.global.name.value === 'customLight' ? 'white' : null" :elevation="12" v-model="drawer">

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
                    <v-avatar v-if="user.photo" color="secondary">
                        <v-img :src="user.photo" alt="User photo"></v-img>
                    </v-avatar>
                    <v-avatar v-else color="secondary">
                       {{ user.name && user.name.split(' ').length > 1 ? user.name.split(' ')[0].charAt(0) + user.name.split(' ').slice(-1)[0].charAt(0) : user.name ? user.name.charAt(0) : '' }}
                    </v-avatar>
                </template>
                <v-list-item-title>
                    <span class="text-wrap font-weight-bold">{{ user.name + ' ' }}</span>
                    <span class="text-wrap">{{ user.role === 'admin' ? '(Admin)' : user.role === 'author' ? '(Author)' : null }}</span> <br>
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
            <v-list-item prepend-icon="mdi-home" to="/" nuxt>
                <template v-slot:title>
                    <span class="font-weight-bold">Home</span>
                </template>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <!-- <v-list nav>
            <v-list-item prepend-icon="mdi-home" @click="toggleTheme" nuxt>
                <template v-slot:title>
                    <span class="font-weight-bold">Theme</span>
                </template>
            </v-list-item>
        </v-list>

        <v-divider></v-divider> -->

        <v-list nav>
            <v-list-item prepend-icon="mdi-movie-open-play-outline" to="/movie" nuxt>
                <template v-slot:title>
                    <span class="font-weight-bold">Movies</span>
                </template>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
            <v-list-item prepend-icon="mdi-television-classic" to="/series" nuxt>
                <template v-slot:title>
                    <span class="font-weight-bold">Series</span>
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
            <v-card color="transparent" elevation="0" v-if="adminBar" class="align-center">
                <v-list-item prepend-icon="mdi-movie-roll" to="/admin/movie" title="Manage Movies"></v-list-item>
                <v-list-item prepend-icon="mdi-shape-plus" to="/admin/genre" title="Manage Genres"></v-list-item>
                <v-list-item prepend-icon="mdi-account-box-multiple" to="/admin/user" title="Manage Users"></v-list-item>
                <v-list-item prepend-icon="mdi-face-man-shimmer" to="/admin/cast" title="Manage Casts"></v-list-item>
                <v-list-item prepend-icon="mdi-account-arrow-right-outline" to="/admin/cast/assign" title="Assign Cast"></v-list-item>
            </v-card>
        </v-list>

        <v-divider v-if="user?.role === 'admin'"></v-divider>

        <v-list v-if="user?.role === 'author'" nav>
            <v-list-item @click="authorBar = !authorBar" prepend-icon="mdi-movie-cog" :append-icon="authorBar ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'">
                <template v-slot:title>
                    <span class="font-weight-bold text-wrap">Author Features</span>
                </template>
            </v-list-item>
            <v-card color="transparent" elevation="0" v-if="authorBar" class="align-center">
                <v-list-item prepend-icon="mdi-movie-roll" to="/author/movie" title="Manage Movies"></v-list-item>
                <v-list-item prepend-icon="mdi-face-man-shimmer" to="/author/cast" title="Manage Casts"></v-list-item>
            </v-card>
        </v-list>

        <v-divider v-if="user?.role === 'author'"></v-divider>

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

        <v-card color="transparent" elevation="0">
            <v-dialog v-model="dialogSignOut">
                <v-card class="d-flex mx-auto" max-width="100%" width="400px">
                    <v-card-title>Sign Out</v-card-title>
                    <v-card-text>Are you sure you want to sign out?</v-card-text>
                    <v-card-actions>
                        <v-btn class="text-none" @click="dialogSignOut = false">Cancel</v-btn>
                        <v-btn class="text-none" color="error" @click="signOut({ callbackUrl: '/' })">Sign Out</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-list v-if="data?.user?.name" nav>
                <v-list-item class="text-error" prepend-icon="mdi-logout-variant" @click="dialogSignOut = true" title="Sign out"></v-list-item>
            </v-list>
        </v-card>
    </v-navigation-drawer>

    <v-app-bar :color="theme.global.name.value === 'customLight' ? 'white' : null" elevation="0">
      <div class="d-flex w-100 justify-space-between align-center">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="d-flex">
            <img src="~/assets/img/logoku.png" width="50px">
            <h2 class="font-bold align-center d-flex ml-2">Moreview</h2>
        </div>
            <v-menu open-on-hover class="d-flex justify-end" v-model="dialogSearch" max-width="600px">
              <template v-slot:activator="{ props }">
              <div class="d-flex">
                <v-icon 
                class="d-flex my-auto mr-3 cursor-pointer"
                @click="dialogSearch = true" 
                v-bind="props" 
                size="28" 
                icon="mdi-magnify">
                </v-icon>
              </div>
              </template>
              <v-card @click.stop width="600px">
                <v-card-title>
                  <span class="headline">Search</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    variant="outlined"
                    v-model="searchQuery"
                    label="Search..."
                    append-inner-icon="mdi-magnify"
                    hide-details
                    @keyup.enter="search(searchQuery)"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-menu>
      </div>
    </v-app-bar>
</template>