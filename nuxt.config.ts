import process from 'node:process'

export default defineNuxtConfig({

  extends: [
    '@h4designs/ui',
  ],

  modules: [
    '@nuxtjs/seo',
    '@nuxt/image',
    '@vite-pwa/nuxt',
    '@nuxt/scripts',
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
      routes: ['/', '/sitemap.xml', '/api/navigation.json', '/api/search.json'],
    },
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    virtual: {
      sharp: 'export default function sharp() { return {} }',
    },
    replace: {
      'process.env.STUDIO_GITHUB_CLIENT_ID': JSON.stringify(process.env.STUDIO_GITHUB_CLIENT_ID),
      'process.env.STUDIO_GITHUB_CLIENT_SECRET': JSON.stringify(process.env.STUDIO_GITHUB_CLIENT_SECRET),
    },
  },

  eslint: {
    config: {
      stylistic: true,
      standalone: false,
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
