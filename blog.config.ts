import process from 'node:process'
import { defineBlogConfig } from '@happydesigns/blog/core'

export default defineBlogConfig({
  sections: {
    blog: {
      collection: 'article',
      basePath: '/blog',
      title: 'Schachfreunde Heilbronn-Biberach Blog',
      description: 'Die neuesten Mannschafts- und Turnierberichte von den Schachfreunden Heilbronn-Biberach.',
      locale: 'de',
      showPreviewImages: false,
      sort: {
        field: 'date',
        direction: 'DESC',
      },
      categories: {
        Jugend: {
          label: 'Jugend',
          color: 'jugend',
        },
        Mannschaft: {
          label: 'Mannschaft',
          color: 'mannschaft',
        },
        Verein: {
          label: 'Verein',
          color: 'verein',
        },
      },
      labels: {
        all: 'Alle',
        empty: 'Keine Berichte gefunden.',
        previous: 'Zurück',
        next: 'Weiter',
      },
      authors: {
        collection: 'user',
      },
      routes: false,
      feed: {
        rss: '/blog/rss.xml',
        atom: false,
        siteUrl: process.env.NUXT_SITE_URL || 'http://localhost:3000',
        language: 'de',
        copyright: `Copyright © 2024-${new Date().getFullYear()} Schachfreunde Heilbronn-Biberach 1978 e. V.`,
        favicon: '/favicon.png',
      },
    },
  },
})
