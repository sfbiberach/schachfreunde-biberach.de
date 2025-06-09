import type { ButtonProps } from '#ui/types'

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

    blog: {
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
    },

    chessboard: {
      summon: {
        chance: 0.15,
        limit: 2,
      },
      pieces: [
        {
          icon: 'i-fa6-solid-chess-pawn',
          moves: {
            step: [[0, 1]],
            start: [[0, 1], [0, 2]],
            capture: [[1, 1]],
          },
        },
        {
          icon: 'i-fa6-solid-chess-knight',
          moves: {
            step: [[2, 1], [1, 2]],
          },
        },
        {
          icon: 'i-fa6-solid-chess-bishop',
          moves: {
            step: [[1, 1], [2, 2], [3, 3]],
          },
        },
        {
          icon: 'i-fa6-solid-chess-rook',
          moves: {
            step: [[0, 1], [0, 2], [0, 3], [1, 0], [2, 0], [3, 0]],
          },
        },
        {
          icon: 'i-fa6-solid-chess-queen',
          moves: {
            step: [[0, 1], [0, 2], [0, 3], [1, 0], [2, 0], [3, 0], [1, 1], [2, 2], [3, 3]],
          },
        },
        {
          icon: 'i-fa6-solid-chess-king',
          moves: {
            step: [[0, 1], [1, 0], [1, 1]],
          },
        },
      ],
    },
  },

  ui: {
    colors: {
      primary: 'verein',
      neutral: 'zinc',
      jugend: 'orange',
      mannschaft: 'green',
      verein: 'blue',
    },
  },

  uiPro: {
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
