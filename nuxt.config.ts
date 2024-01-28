export default defineNuxtConfig({
  content: {
    documentDriven: true,
  },
  devtools: { enabled: true },
  extends: [
    '@nuxt/ui-pro',
    'nuxt-umami',
  ],
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxthq/studio',
    '@nuxtjs/plausible',
    'nuxt-og-image',
  ],
  ui: {
    icons: [
      'ph',
      'simple-icons',
      'fa6-solid',
    ],
  },
})
