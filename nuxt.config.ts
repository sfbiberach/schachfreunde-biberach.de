export default defineNuxtConfig({

  extends: [
    '@nuxt/ui-pro',
    'github:happydesigns/ui-base',
  ],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxthq/studio',
    // '@nuxthub/core',
    '@vite-pwa/nuxt',
    'nuxt-og-image',
  ],

  devtools: { enabled: true },
  content: {
    documentDriven: true,
  },

  ui: {
    safelistColors: ['blue', 'green', 'orange'],
  },

  routeRules: {
    '/api/blog.json': { prerender: true },
    '/api/blog/**': { prerender: true },
    '/blog/rss.xml': { prerender: true },
    '/': { prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    viewTransition: true,
  },

  compatibilityDate: '2024-07-08',

  nitro: {
    prerender: {
      failOnError: false,
    },
  },

  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },

  pwa: {
    manifest: {
      name: 'Schachfreunde Heilbronn-Biberach 1978 e. V.',
      short_name: 'SF HN-Biberach',
      description: 'Der Schachverein im Heilbronner Stadtteil Biberach',
      theme_color: '#171717',
      background_color: '#171717',
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
    registerType: 'autoUpdate',
    devOptions: {
      enabled: false,
    },
  },
})
