// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-15',
  devtools: { enabled: false },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/color-mode',
  ],
  routeRules: {
    '/': { prerender: true }
  },
  app: {
    baseURL: '/games/'
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },
})
