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
    '@vite-pwa/nuxt',
    'nuxt-og-image',
  ],
  nitro: {
    prerender: {
      routes: [
        '/api/blog.json',
      ],
    },
  },
  pwa: {
    manifest: {
      name: 'Schachfreunde Heilbronn-Biberach 1978 e. V.',
      short_name: 'SF HN-Biberach',
      description: 'Der Schachverein im Heilbronner Stadtteil Biberach',
      theme_color: '#171717',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
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
