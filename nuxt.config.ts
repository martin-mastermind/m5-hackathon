export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  future: { compatibilityVersion: 4 },

  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/scripts'],

  hub: {
    database: true,
  },

  devtools: { enabled: true },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },
})
