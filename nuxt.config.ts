export default defineNuxtConfig({
  content: {
    documentDriven: true,
  },
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxthq/studio',
    '@nuxtjs/plausible',
    'nuxt-og-image',
  ],
  ui: {
    icons: ['ph', 'simple-icons'],
  },
})
