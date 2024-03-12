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
  ],
  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxthq/studio',
    'nuxt-og-image',
  ],
  nitro: {
    prerender: {
      routes: [
        '/api/search.json',
      ],
    },
  },
  ui: {
    icons: [
      'ph',
      'simple-icons',
      'fa6-solid',
    ],
    safelistColors: ['blue', 'green', 'orange'],
  },
})
