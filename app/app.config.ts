import type { ButtonProps } from '@nuxt/ui'

export default defineAppConfig({
  app: {
    meta: {
      copyright: {
        copyrightYear: new Date().getFullYear(),
        copyrightHolder: 'happydesigns',
        copyrightHomepage: 'https://happydesigns.de',
      },
      socials: [
        {
          icon: 'i-simple-icons-instagram',
          color: 'neutral' as const,
          variant: 'ghost' as const,
          to: 'https://www.instagram.com/schachfreundeheilbronnbiberach',
          target: '_blank',
        },
        {
          icon: 'i-simple-icons-facebook',
          color: 'neutral' as const,
          variant: 'ghost' as const,
          to: 'https://www.facebook.com/Schachfreunde.HN.Biberach',
          target: '_blank',
        },
        {
          icon: 'i-simple-icons-github',
          color: 'neutral' as const,
          variant: 'ghost' as const,
          to: 'https://github.com/sfbiberach',
          target: '_blank',
        },
      ] as ButtonProps[],
      github: {
        repo: 'sfbiberach/schachfreunde-biberach.de',
        branch: 'main',
        dir: 'content',
      },
    },

    icons: {
      article: 'i-ph-newspaper',
      team: 'i-ph-castle-turret',
      tournament: 'i-ph-trophy',
    },

    links: {
      header: [
        {
          label: 'Blog',
          icon: 'i-ph-newspaper',
          to: '/blog',
        },
        {
          label: 'Mannschaften',
          icon: 'i-ph-castle-turret-duotone',
          to: '/mannschaften',
        },
        {
          label: 'Turniere',
          icon: 'i-ph-trophy-duotone',
          to: '/turniere',
        },
      ],
      footer: [
        {
          label: 'Homepage',
          children: [
            {
              label: 'Startseite',
              to: '/',
              icon: 'i-ph-house-duotone',
            },
            {
              label: 'Blog',
              to: '/blog',
              icon: 'i-ph-newspaper',
            },
            {
              label: 'Mannschaften',
              to: '/mannschaften',
              icon: 'i-ph-castle-turret-duotone',
            },
            {
              label: 'Turniere',
              to: '/turniere',
              icon: 'i-ph-trophy-duotone',
            },
          ],
        },
        {
          label: 'Rechtliches',
          children: [
            {
              label: 'Impressum',
              to: '/impressum',
              icon: 'i-ph-file-text-duotone',
            },
            {
              label: 'Datenschutz',
              to: '/datenschutz',
              icon: 'i-ph-shield-duotone',
            },
          ],
        },
        {
          label: 'Externe Links',
          children: [
            {
              label: 'Unterländer Schachtage',
              to: 'https://www.unterlaender-schachtage.de/',
              target: '_blank',
              icon: 'i-ph-crown-duotone',
            },

            {
              label: 'Aktuelle DWZ-Liste',
              to: 'https://schach.in/zahlen/C0652/',
              target: '_blank',
              icon: 'i-ph-chart-bar-duotone',
            },
            {
              label: 'Google Vereinskalender',
              to: 'https://calendar.google.com/calendar/embed?src=dimi.triantafillidis%40web.de&ctz=Europe%2FBerlin',
              target: '_blank',
              icon: 'i-ph-calendar-duotone',
            },
          ],
        },
      ],
    },

    date: {
      locale: 'de',
      options: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    },

    toc: {
      title: 'Inhaltsverzeichnis',
    },
  },

  content: {
    traits: {
      copyButton: {
        label: 'URL kopieren',
        successLabel: 'Link in Zwischenablage kopiert',
      },
      separator: {
        buttons: [
          { type: 'github-edit', icon: 'i-lucide-pen', label: 'Artikel bearbeiten', target: '_blank' },
          { type: 'report-github-issue', icon: 'i-ph-warning-circle', label: 'Fehler melden', target: '_blank' },
        ],
        separator: '·',
      },
    },
    collections: {
      article: {
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
        breadcrumbs: [
          {
            label: 'Blog',
            to: '/blog',
            icon: 'i-ph-newspaper',
          },
        ],
        backButton: {
          label: 'Zurück zum Blog',
        },
        list: {
          labelAll: 'Alle',
          noResultsMessage: 'Keine Berichte gefunden.',
        },
      },
      team: {
        breadcrumbs: [
          {
            label: 'Mannschaften',
            to: '/mannschaften',
            icon: 'i-ph-castle-turret',
          },
        ],
        backButton: {
          label: 'Zurück zur Übersicht',
          icon: 'i-ph-arrow-left',
        },
        list: {
          labelAll: 'Alle',
          noResultsMessage: 'Keine Mannschaften gefunden.',
        },
      },
      tournament: {
        breadcrumbs: [
          {
            label: 'Turniere',
            to: '/turniere',
            icon: 'i-ph-trophy',
          },
        ],
        backButton: {
          label: 'Zurück zur Übersicht',
          icon: 'i-ph-arrow-left',
        },
        list: {
          labelAll: 'Alle',
          noResultsMessage: 'Keine Turniere gefunden.',
        },
      },
    },
  },

  theme: {
    radius: 0.2,
    blackAsPrimary: false,
  },

  ui: {
    colors: {
      primary: 'verein',
      neutral: 'zinc',
      jugend: 'orange',
      mannschaft: 'green',
      verein: 'blue',
    },
    pageHero: {
      slots: {
        container: 'py-10 sm:py-20 lg:py-20',
        title: 'sm:text-5xl',
      },
    },
    footer: {
      slots: {
        top: 'border-b border-default',
      },
    },
  },

  newsletter: {
    visible: false,
    label: 'Abboniere unseren Newsletter',
    description: 'Bleibe auf dem Laufenden über neue Beiträge, Veranstaltungen und mehr.',
    placeholder: 'deine-email@domain.com',
    buttonText: 'Abonnieren',
  },
})
