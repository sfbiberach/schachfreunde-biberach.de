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
    '/kontakt': { prerender: true },
    '/mannschaften': { prerender: true },
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
      ignore: [route => route.startsWith('/mannschaften/') && !route.endsWith('/_payload.json')],
      routes: ['/', '/kontakt', '/impressum', '/datenschutz', '/sitemap.xml', '/api/navigation.json', '/api/search.json'],
    },
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

  hooks: {
    'pages:extend': (pages) => {
      if (process.env.NUXT_MEDIA_PREVIEW !== '1') {
        for (let index = pages.length - 1; index >= 0; index -= 1) {
          if (pages[index]?.path.startsWith('/__media')) {
            pages.splice(index, 1)
          }
        }
      }
    },
    'build:manifest': (manifest) => {
      for (const chunk of Object.values(manifest)) {
        if (chunk.resourceType === 'script') {
          chunk.preload = false
        }
      }
    },
  },

  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },

  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal'],
        subsets: ['latin'],
        global: true,
      },
      {
        name: 'Lora',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal'],
        subsets: ['latin'],
        global: true,
      },
    ],
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

  ogImage: {
    enabled: true,
    defaults: {
      width: 1200,
      height: 630,
      extension: 'png',
      emojis: false,
      cacheMaxAgeSeconds: 60 * 60 * 24 * 7,
    },
    buildCache: true,
    runtimeCacheStorage: 'cache',
    security: {
      maxDimension: 1350,
      maxDpr: 1,
      renderTimeout: 10_000,
      imageFetchTimeout: 3_000,
      maxQueryParamSize: 2048,
      restrictRuntimeImagesToOrigin: true,
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
    client: {
      registerPlugin: false,
    },
    workbox: {
      globIgnores: ['**/_worker.js/**/*'],
    },
  },

  sitemap: {
    zeroRuntime: true,
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
      team: {
        extends: 'event',
      },
      tournament: {
        extends: 'event',
      },
    },
  },

})
