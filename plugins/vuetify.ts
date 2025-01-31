// @ts-nocheck

import { createVuetify } from "vuetify"
import { fa } from "vuetify/iconsets/fa"
import { aliases, mdi } from "vuetify/lib/iconsets/mdi"

// import from vuetify/locale to specify vuetify language
// Example for Spanish language:
// import { es } from 'vuetify/locale'

import "@mdi/font/css/materialdesignicons.css"
import "@fortawesome/fontawesome-free/css/all.css"

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        ssr: true,
        //Use your custom vuetify themes:
        theme: {
            defaultTheme: "customLight", // Use the light theme by default
            themes: {
                customLight: {
                    dark: false, // Light theme
                    colors: {
                        background: "#FFFFFF", // White for a clean background
                        surface: "#F5F5F5",    // Light gray for surface
                        primary: "#FF5757",   // Your primary color
                        secondary: "#FF8A57", // Soft complementary orange tone
                        error: "#FF3D3D",     // Slightly darker red for errors
                        info: "#57A9FF",      // Cool blue tone for info
                        success: "#57FF8A",   // Soft green for success
                        warning: "#FFB057",   // Warm complementary yellow-orange
                    },
                },
            },
        },
        // Example for Spanish language
        /*
        locale: {
            locale: 'es',
            messages: { es },
        },
        */
        Icons: {
            defaultSet: "mdi",
            aliases,
            sets: {
              mdi,
              fa,
            },
        },
    })

    nuxtApp.vueApp.use(vuetify)
})