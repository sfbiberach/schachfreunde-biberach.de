export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'zinc',
    icons: {
      light: 'i-ph-sun-duotone',
      dark: 'i-ph-moon-duotone',
    },
    button: {
      default: {
        size: 'md',
      },
    },
  },
  app: {
    blog: {
      badges: {
        Jugend: {
          label: 'Jugend',
          color: 'orange',
        },
        Mannschaft: {
          label: 'Mannschaft',
          color: 'green',
        },
        Verein: {
          label: 'Verein',
          color: 'blue',
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
  links: {
    header: [
      {
        label: 'Blog',
        icon: 'i-fa6-solid-newspaper',
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
    footer: [{
      label: 'Homepage',
      children: [{
        label: 'Startseite',
        to: '/',
      }, {
        label: 'Blog',
        to: '/blog',
      }, {
        label: 'Mannschaften',
        to: '/mannschaften',
      }, {
        label: 'Turniere',
        to: '/turniere',
      }],
    }, {
      label: 'Wichtige Links',
      children: [{
        label: 'Unterländer Schachtage',
        to: 'https://www.unterlaender-schachtage.de/',
        target: '_blank',
      }, {
        label: 'Aktuelle DWZ-Liste',
        to: 'https://schach.in/zahlen/C0652/',
        target: '_blank',
      }, {
        label: 'Google Vereinskalender',
        to: 'https://calendar.google.com/calendar/embed?src=dimi.triantafillidis%40web.de&ctz=Europe%2FBerlin',
        target: '_blank',
      }],
    }, {
      label: 'Rechtliches',
      children: [{
        label: 'Impressum',
        to: '/impressum',
      }, {
        label: 'Datenschutz',
        to: '/datenschutz',
      }],
    }],
  },
  newsletter: {
    visible: false,
    label: 'Abboniere unseren Newsletter',
    description: 'Bleibe auf dem Laufenden über neue Beiträge, Veranstaltungen und mehr.',
    placeholder: 'deine-email@domain.com',
    buttonText: 'Abonnieren',
  },
})
