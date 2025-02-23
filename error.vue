<template>
   <v-app style="background-image: url('/404.jpg'); height: 100vh; background-repeat: no-repeat; background-size: cover; background-position-y: bottom;" class="d-flex justify-center align-center">
      <v-card color="transparent" class="pa-0 mx-auto my-auto">
         <v-card-text class="text-center text-h5 pa-0 text-white">Oops...</v-card-text>
         <v-card-title class="text-center text- text-h1 pa-0 text-white">{{ error.statusCode }}</v-card-title>
         <v-card-text class="text-center text-h5 pa-0 text-white">{{ error.statusMessage }}<br>Back to 
            <span class="cursor-pointer text-decoration-underline text-white" @click="navigateTo('/')">main page.</span>
         </v-card-text>
      </v-card>
   </v-app>
</template>

<script setup>
import { useHead } from "#imports";
import { ref, onMounted } from "vue";

defineProps({
  error: Object
})

useHead({
  title: `${error.statusCode} - Moreview`,
  meta: [
    { name: "description", content: "Create an account on Moreview" },
    { name: "keywords", content: "Moreview, Register, Account" },
  ],
});

definePageMeta({
  auth: {
    unauthenticatedOnly: false,
  },
});
</script>