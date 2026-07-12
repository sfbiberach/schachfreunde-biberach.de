import process from 'node:process'

export default defineNuxtConfig({

  extends: [
    '@happydesigns/ui',
  ],

  modules: [
    '@nuxt/eslint',
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
    '/mannschaften': { prerender: true },
    '/mannschaften/**': { prerender: false },
  },

  experimental: {
    viewTransition: true,
  },

  compatibilityDate: '2026-07-09',

  nitro: {
    storage: {
      cache: {
        driver: 'cloudflare-kv-binding',
        binding: 'NULIGA_CACHE',
      },
    },
    devStorage: {
      cache: {
        driver: 'fs',
        base: './.data/nuliga-cache',
      },
    },
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: false,
      failOnError: true,
      routes: ['/', '/impressum', '/datenschutz', '/sitemap.xml', '/api/navigation.json', '/api/search.json'],
    },
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        d1_databases: [{ binding: 'DB' }],
        kv_namespaces: [{ binding: 'NULIGA_CACHE' }],
      },
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

  icon: {
    fallbackToApi: false,
    serverBundle: {
      collections: ['heroicons', 'lucide', 'ph', 'simple-icons'],
      remote: 'jsdelivr',
    },
    clientBundle: {
      scan: {
        globInclude: ['**/*.{vue,js,mjs,ts,jsx,tsx,md,mdc,mdx,yml,yaml}'],
      },
      sizeLimitKb: 256,
    },
  },

  image: {
    quality: 80,
    format: ['avif', 'webp', 'jpg'],
  },

  ogImage: false,

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
  variants: {
    registry: {
      articleTournament: {},
      team: {
        extends: 'event',
      },
      tournament: {
        extends: 'event',
      },
      article: {
        extends: [
          'articleTournament',
        ],
      },
    },
  },

})
