<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '#imports';

useHead({
  title: 'Manage Movies - Moreview',
  meta: [
    { name: 'description', content: 'Admin manage movies on Moreview' },
    { name: 'keywords', content: 'Moreview, Manage movies, movies, Account' },
  ]
});

const { $moment } = useNuxtApp()
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
                window.location.href = '/'
            }, 1000)
        }
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}
const showToast = inject('showToast')

// Movie Form
const title = ref('')
const description = ref('')
const poster = ref('')
const releaseYear = ref('')
const duration = ref('')
const rating = ref('')
const creator = ref('')
const trailer = ref('')
const genreIds = ref([])
const form = ref(false)
const addMovieDialog = ref(false)
const genres = ref([])

// Fetch Movies
const movies = ref([])
const search = ref('')
const loading = ref(true)

const fetchMovies = async () => {
  try {
    const response = await fetch('/api/movie/getMovie')
    loading.value = false
    if (!response.ok) {
      throw new Error('Failed to fetch movies')
    }
    const data = await response.json()
    movies.value = data || []
  } catch (error) {
    console.error("Error fetching movies:", error)
  }
}

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
  fetchMovies()
  fetchGenres()
  getAuthUser()
})

// Add Movie
const addMovie = async () => {
  const { data, error } = await useFetch('/api/movie/add', {
    method: "POST",
    body: {
      title: title.value,
      description: description.value,
      poster: poster.value,
      release_year: parseInt(releaseYear.value),
      duration: parseInt(duration.value),
      rating: parseInt(rating.value),
      creator: creator.value,
      trailer: trailer.value,
      genreIds: genreIds.value,
    }
  })

  if (error.value) {
    showToast(error.value.statusMessage, 'error')
    return
  }
  showToast('Movie added successfully', 'success')
  window.location.reload()
}

// Delete Movie
const deleteMovie = async (id) => {
  try {
    const response = await fetch(`/api/movie/delete/${id}`, {
      method: 'PATCH',
    })

    if (!response.ok) {
      throw new Error('Failed to delete movie')
    }

    showToast('Movie deleted successfully', 'success')
    window.location.reload()
  } catch (error) {
    console.error('Error deleting movie:', error)
    showToast('Error deleting movie', 'error')
  }
}

// Restore Movie
const restoreMovie = async (id) => {
  try {
    const response = await fetch(`/api/movie/restore/${id}`, {
      method: 'PATCH',
    })

    if (!response.ok) {
      throw new Error('Failed to restore movie')
    }

    showToast('Movie restored successfully', 'success')
    window.location.reload()
  } catch (error) {
    console.error('Error restoring movie:', error)
    showToast('Error restoring movie', 'error')
  }
}

// Edit Movie
const editMovieDialog = ref(false)
const editForm = ref(false)
const editId = ref(null)

const editMovie = (movie) => {
  editId.value = movie.id
  title.value = movie.title
  description.value = movie.description
  poster.value = movie.poster
  releaseYear.value = movie.release_year
  duration.value = movie.duration
  rating.value = movie.rating
  creator.value = movie.creator
  trailer.value = movie.trailer
  genreIds.value = movie.genres_relations.map((relation) => relation.genre_id)
  editMovieDialog.value = true
}

const updateMovie = async () => {
  const { data, error } = await useFetch(`/api/movie/update/${editId.value}`, {
    method: "PATCH",
    body: {
      title: title.value,
      description: description.value,
      poster: poster.value,
      release_year: releaseYear.value,
      duration: duration.value,
      rating: rating.value,
      creator: creator.value,
      trailer: trailer.value,
      genreIds: genreIds.value,
    }
  })

  if (error.value) {
    showToast(error.value.statusMessage, 'error')
    return
  }
  showToast('Movie updated successfully', 'success')
  editMovieDialog.value = false
  window.location.reload()
}

// Date Formatting
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

</script>

<template>
   <v-container v-if="isAdmin">
     <!-- Add Movie Dialog -->
     <v-dialog v-model="addMovieDialog">
       <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
         <v-card-title class="d-flex align-center">
           <v-icon class="mr-2">mdi-plus</v-icon>
           <h2 class="text-wrap">Add Movie</h2>
         </v-card-title>
         <v-card-text>
           <v-form v-model="form" @submit.prevent="addMovie">
             <v-text-field v-model="title" label="Title" required variant="outlined"></v-text-field>
             <v-textarea v-model="description" label="Description" variant="outlined"></v-textarea>
             <v-text-field v-model="releaseYear" label="Release Year" type="number" required variant="outlined"></v-text-field>
             <v-text-field v-model="duration" label="Duration (minutes)" type="number" required variant="outlined"></v-text-field>
             <v-text-field v-model="rating" label="Rating" required variant="outlined"></v-text-field>
             <v-text-field v-model="creator" label="Creator" required variant="outlined"></v-text-field>
             <v-text-field v-model="trailer" label="Trailer URL" variant="outlined"></v-text-field>
             <v-select
               v-model="genreIds"
               :items="genres"
               item-title="title"
               item-value="id"
               label="Genres"
               multiple
               variant="outlined"
             ></v-select>
             <v-btn type="submit" color="primary">Add Movie</v-btn>
             <v-btn @click="addMovieDialog = false" class="ml-2">Cancel</v-btn>
           </v-form>
         </v-card-text>
       </v-card>
     </v-dialog>
 
     <!-- Movie Table -->
     <v-card color="white" elevation="4">
       <v-card-title class="d-flex justify-space-between flex-wrap">
         <div class="d-flex flex-wrap">
           <div class="d-flex align-center" width="100%">
             <h2 class="mr-2">Movies</h2>
             <v-chip color="primary">{{ movies.length }}</v-chip>
           </div>
           <div class="align-center d-flex mt-2 mt-md-0 ml-0 ml-md-5">
             <v-btn color="primary" @click="addMovieDialog = true" icon="mdi-plus"></v-btn>
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
           { title: 'Title', align: 'start', sortable: true, key: 'title' },
           { title: 'Release Year', align: 'start', sortable: true, key: 'release_year' },
           { title: 'Duration', align: 'start', sortable: true, key: 'duration' },
           { title: 'Rating', align: 'start', sortable: true, key: 'rating' },
           { title: 'Created Date', align: 'start', sortable: true, key: 'created_at' },
           { title: 'Updated Date', align: 'start', sortable: true, key: 'updated_at' },
           { title: 'Deleted Date', align: 'start', sortable: true, key: 'deleted_at' },
           { title: 'Actions', align: 'start', sortable: false, key: 'actions' }
         ]"
         :search="search"
         :items="movies"
         :loading="loading"
         :items-per-page="10"
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
         <template v-slot:item.deleted_at="{ item }">
           {{ item.deleted_at ? formatDate(item.deleted_at) : '-' }}
         </template>
 
         <!-- Actions Column -->
         <template v-slot:item.actions="{ item }">
           <v-btn class="ma-1" icon @click="editMovie(item)">
             <v-icon>mdi-pencil</v-icon>
           </v-btn>
           <v-btn v-if="item.deleted_at === null" class="ma-1" icon @click="deleteMovie(item.id)" color="error">
             <v-icon>mdi-delete</v-icon>
           </v-btn>
           <v-btn v-else class="ma-1" icon @click="restoreMovie(item.id)" color="success">
             <v-icon>mdi-restore</v-icon>
           </v-btn>
         </template>
       </v-data-table>
     </v-card>
 
     <!-- Edit Movie Dialog -->
     <v-dialog v-model="editMovieDialog">
       <v-card width="100%" max-width="500px" class="d-flex mx-auto my-auto">
         <v-card-title class="d-flex align-center">
           <v-icon class="mr-2">mdi-pencil</v-icon>
           <h2 class="text-wrap">Edit Movie</h2>
         </v-card-title>
         <v-card-text>
           <v-form v-model="editForm" @submit.prevent="updateMovie">
             <v-text-field v-model="title" label="Title" required variant="outlined"></v-text-field>
             <v-textarea v-model="description" label="Description" variant="outlined"></v-textarea>
             <v-text-field v-model="releaseYear" label="Release Year" type="number" required variant="outlined"></v-text-field>
             <v-text-field v-model="duration" label="Duration (minutes)" type="number" required variant="outlined"></v-text-field>
             <v-text-field v-model="rating" label="Rating" required variant="outlined"></v-text-field>
             <v-text-field v-model="creator" label="Creator" required variant="outlined"></v-text-field>
             <v-text-field v-model="trailer" label="Trailer URL" variant="outlined"></v-text-field>
             <v-select
               v-model="genreIds"
               :items="genres"
               item-title="title"
               item-value="id"
               label="Genres"
               multiple
               variant="outlined"
             ></v-select>
             <v-btn type="submit" color="primary">Update Movie</v-btn>
             <v-btn @click="editMovieDialog = false" class="ml-2">Cancel</v-btn>
           </v-form>
         </v-card-text>
       </v-card>
     </v-dialog>
   </v-container>
 </template>