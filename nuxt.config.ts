import vuetify from "vite-plugin-vuetify"
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  css: ["vuetify/styles"],
  sourcemap: { server: false, client: false },

  modules: [
      async (options, nuxt) => {
          nuxt.hooks.hook("vite:extendConfig", (config) => 
              // @ts-ignore
              config.plugins.push(
                  // Here you can specify a custom styles file for vuetify
                  vuetify({
                      styles: { configFile: "assets/settings.scss" }
                  })
              )
          )
      },
      '@sidebase/nuxt-auth',
      '@nuxtjs/google-fonts',
      '@nuxt/icon',
  ],

  plugins: [
          '~/plugins/moment.js'
      ],

  auth: {
      provider: {
        type: 'authjs',
      },
      globalAppMiddleware: {
        isEnabled: true
      }
  },

  build: {
      transpile: ["vuetify", '@vuepic/vue-datepicker']
  },
  vite: { ssr: { noExternal: ["vuetify"] } },

  // @ts-ignore
  // Here you can specify a custom font for the app
  googleFonts: {
      families: {
          Poppins: [100, 200, 300, 400 , 500, 600, 700, 800, 900],
      },
      download: false,
      useStylesheet: true
  },

  compatibilityDate: "2025-02-03"
})