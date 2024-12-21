// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-15',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  routeRules: {
    '/': { prerender: true }
  },
  app: {
    baseURL: '/games/'
  },
  css: ['~/assets/css/main.css'],
})