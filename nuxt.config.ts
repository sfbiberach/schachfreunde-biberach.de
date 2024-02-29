export default defineNuxtConfig({
  content: {
    documentDriven: true,
  },
  devtools: { enabled: true },
  experimental: {
    viewTransition: true,
  },
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
    '@nuxt/fonts',
  ],
  ui: {
    icons: [
      'ph',
      'simple-icons',
      'fa6-solid',
    ],
    safelistColors: ['blue', 'green', 'orange'],
  },
})
