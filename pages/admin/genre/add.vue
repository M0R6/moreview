<script setup>
import { onMounted } from 'vue'

const { data } = useAuth()

const isAdmin = computed(() => data.value?.user?.role === 'admin')

onMounted(() => {
    if (!isAdmin.value) {
        showToast('Access denied', 'error')
        setTimeout(() => {
            window.location.href = '/'
        }, 1000)
    }
})

const showToast = inject('showToast')

const title = ref('')

const form = ref(false)

const addGenre = async () => {
    const { data, error } = await useFetch(`/api/add/genre`, {
        method: "POST",
        body: {
            title: title.value,
        }
    })

    if (error.value) {
        showToast(error.value.statusMessage, 'error')
        return
    }
    showToast(data.value.message)
    window.location.reload()
    
}
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card v-if="isAdmin">
                    <v-card-title>
                        <h2>Add Genre</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-form v-model="form" @submit.prevent="addGenre">
                            <v-text-field
                                v-model="title"
                                label="Title"
                                required
                            ></v-text-field>
                            <v-btn type="submit" color="primary">Add Genre</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

