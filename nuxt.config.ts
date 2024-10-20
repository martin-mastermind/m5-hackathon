export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  future: { compatibilityVersion: 4 },

  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/scripts'],

  app: {
    head: {
      script: [{ src: 'https://telegram.org/js/telegram-web-app.js' }],
    },
  },

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
