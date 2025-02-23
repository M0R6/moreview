<template>
   <v-container>
     <v-row justify="center">
       <v-col cols="12" md="8" lg="6">
         <v-card v-if="movie" elevation="3">
           <v-img v-if="movie.poster" :src="movie.poster" height="400px" cover></v-img>
           <v-card-title class="text-h5 font-weight-bold">
             {{ movie.title }}
           </v-card-title>
           <v-card-subtitle>
             Created by: {{ movie.createdBy?.name || 'Unknown' }}
           </v-card-subtitle>
           <v-card-text>
             <p>{{ movie.description }}</p>
             <v-chip-group v-if="movie.genres_relations?.length" class="mt-2">
               <v-chip v-for="genre in movie.genres_relations" :key="genre.genre.id" color="primary">
                 {{ genre.genre.name }}
               </v-chip>
             </v-chip-group>
           </v-card-text>
         </v-card>
         <v-alert v-else type="error">Movie not found.</v-alert>
       </v-col>
     </v-row>
   </v-container>
 </template>
 
 <script setup>
 import { useRoute } from 'vue-router';
 import { ref, onMounted } from 'vue';
 
 const route = useRoute();
 const movie = ref(null);
 const error = ref(null);
 
 const fetchMovieDetails = async () => {
   try {
     const response = await fetch(`/api/movie/${route.params.id}`);
     if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);
     
     movie.value = await response.json();
   } catch (err) {
     console.error('Error fetching movie:', err);
     error.value = err.message;
   }
 };
 
 onMounted(() => {
   fetchMovieDetails();
 });
 </script>
 
 <style scoped>
 .v-card {
   padding: 16px;
 }
 </style>
 