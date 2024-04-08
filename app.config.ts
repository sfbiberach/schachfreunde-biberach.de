export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'neutral',
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
      categories: {
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
        icon: 'i-ph-newspaper',
        to: '/blog',
      },
      {
        label: 'Mannschaften',
        icon: 'i-ph-castle-turret-duotone',
        to: '/mannschaften',
        children: [
          {
            label: '1. Mannschaft',
            to: 'https://ergebnisse.svw.info/show/2023/3277/',
            target: '_blank',
          },
          {
            label: '2. Mannschaft',
            to: 'https://ergebnisse.svw.info/show/2023/3315/',
            target: '_blank',
          },
          {
            label: '3. Mannschaft',
            to: 'https://ergebnisse.svw.info/show/2023/3319/',
            target: '_blank',
          },
          {
            label: '1. Jugendmannschaft',
            to: 'https://ergebnisse.svw.info/show/2023/3369/',
            target: '_blank',
          },
          {
            label: '2. Jugendmannschaft',
            to: 'https://ergebnisse.svw.info/show/2023/3385/',
            target: '_blank',
          },
        ],
      },
      {
        label: 'Turniere',
        icon: 'i-ph-trophy-duotone',
        to: '/turniere',
      },
    ],
    footer: [{
      label: 'Homepage',
      to: '/',
      children: [{
        label: 'Startseite',
        to: '/',
        icon: 'i-ph-house-duotone',
      }, {
        label: 'Blog',
        to: '/blog',
        icon: 'i-ph-newspaper',
      }, {
        label: 'Mannschaften',
        to: '/mannschaften',
        icon: 'i-ph-castle-turret-duotone',
      }, {
        label: 'Turniere',
        to: '/turniere',
        icon: 'i-ph-trophy-duotone',
      }],
    }, {
      label: 'Rechtliches',
      to: '/',
      children: [{
        label: 'Impressum',
        to: '/impressum',
        icon: 'i-ph-file-text-duotone',
      }, {
        label: 'Datenschutz',
        to: '/datenschutz',
        icon: 'i-ph-shield-duotone',
      }],
    }, {
      label: 'Externe Links',
      to: '/',
      children: [{
        label: 'Unterländer Schachtage',
        to: 'https://www.unterlaender-schachtage.de/',
        target: '_blank',
        icon: 'i-ph-crown-duotone',
      }, {
        label: 'Aktuelle DWZ-Liste',
        to: 'https://schach.in/zahlen/C0652/',
        target: '_blank',
        icon: 'i-ph-chart-bar-duotone',
      }, {
        label: 'Google Vereinskalender',
        to: 'https://calendar.google.com/calendar/embed?src=dimi.triantafillidis%40web.de&ctz=Europe%2FBerlin',
        target: '_blank',
        icon: 'i-ph-calendar-duotone',
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
