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
    '@nuxt/fonts',
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
    safelistColors: ['blue', 'green', 'orange'],
  },
})
