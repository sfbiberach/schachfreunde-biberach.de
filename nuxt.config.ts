export default defineNuxtConfig({

  extends: [
    'github:happydesigns/ui#v0.5.1',
  ],

  modules: [
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-studio',
    '@vite-pwa/nuxt',
    '@nuxt/scripts',
    '@nuxt/eslint',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'error',
        'jugend',
        'mannschaft',
        'verein',
      ],
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/blog/rss.xml': { prerender: true },
  },

  experimental: {
    viewTransition: true,
  },

  compatibilityDate: 'latest',

  nitro: {
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: false,
      failOnError: false,
      routes: ['/', '/sitemap.xml'],
    },
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },

  fonts: {
    experimental: {
      processCSSVariables: true,
    },
  },

  image: {
    quality: 80,
    format: ['avif', 'webp', 'jpg'],
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
    client: {
      registerPlugin: false,
    },
    workbox: {
      globIgnores: ['**/_worker.js/**/*'],
    },
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'sfbiberach',
      repo: 'schachfreunde-biberach.de',
      branch: 'main',
    },
  },
})
