<script setup>
import { useTheme } from "vuetify";
import { provide } from "vue";

const { toast, message, color, showToast } = useToast();
const theme = useTheme();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark
    ? "customLight"
    : "customDark";
}

provide("theme", theme);
provide("toast", toast);
provide("message", message);
provide("color", color);
provide("showToast", showToast);
provide("toggleTheme", toggleTheme);
</script>

<template>
  <NuxtLayout>
    <v-snackbar
      v-model="toast"
      :color="color"
      :timeout="3000"
      location="bottom"
    >
      {{ message }}
    </v-snackbar>
    <v-tooltip :text="theme.global.name.value === 'customLight' ? 'Change to Dark Mode' : 'Change to  Light Mode'">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          class="d-flex mb-2 pa-4 align-content-center text-none"
          style="position: fixed; bottom: 20px; right: 20px; z-index: 1000"
          location="bottom end"
          icon
          :color="theme.global.name.value === 'customLight' ? '    ' : '#121212'"
          @click="toggleTheme"
          ><v-icon class="mx-auto my-auto" size="28">{{
            theme.global.name.value === "customLight"
              ? "mdi-weather-night"
              : "mdi-white-balance-sunny"
          }}</v-icon></v-btn
        >
      </template>
    </v-tooltip>
    <NuxtPage />
  </NuxtLayout>
</template>