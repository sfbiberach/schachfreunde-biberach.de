export default defineNuxtConfig({
  content: {
    documentDriven: true,
  },
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxtjs/plausible',
    '@nuxt/devtools',
    '@nuxt/content',
    '@nuxt/ui',
    'nuxt-og-image',
    '@nuxt/image',
  ],
  ui: {
    icons: ['ph'],
  },
})
