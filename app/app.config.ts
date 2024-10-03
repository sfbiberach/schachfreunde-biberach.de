export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'neutral',
    icons: {
      light: 'i-ph-sun-duotone',
      dark: 'i-ph-moon-duotone',
      search: 'i-ph-magnifying-glass-duotone',
      external: 'i-ph-arrow-up-right',
      chevron: 'i-ph-caret-down',
      hash: 'i-ph-hash-duotone',
    },
    header: {
      wrapper: 'lg:mb-0 border-0',
      links: {
        trailingIcon: {
          base: 'w-4 h-4',
        },
        popover: {
          popper: {
            strategy: 'absolute',
          },
          ui: {
            width: 'w-[16rem]',
          },
        },
      },
      button: {
        icon: {
          open: 'i-ph-list',
          close: 'i-ph-x',
        },
      },
    },
    navigation: {
      accordion: {
        button: {
          trailingIcon: {
            base: 'w-4 h-4',
          },
        },
      },
    },
    avatar: {
      default: {
        icon: 'i-ph-image',
      },
    },
    button: {
      default: {
        size: 'md',
        loadingIcon: 'i-ph-spinner',
      },
    },
    input: {
      default: {
        loadingIcon: 'i-ph-spinner',
      },
    },
    select: {
      default: {
        loadingIcon: 'i-ph-spinner',
        trailingIcon: 'i-ph-caret-down',
      },
    },
    selectMenu: {
      default: {
        selectedIcon: 'i-ph-check',
      },
    },
    notification: {
      default: {
        closeButton: {
          icon: 'i-ph-x',
        },
      },
    },
    commandPalette: {
      default: {
        icon: 'i-ph-magnifying-glass-duotone',
        loadingIcon: 'i-ph-spinner',
        selectedIcon: 'i-ph-check',
        emptyState: {
          icon: 'i-ph-magnifying-glass-duotone',
        },
        closeButton: {
          icon: 'i-ph-x',
        },
      },
    },
    table: {
      default: {
        sortAscIcon: 'i-ph-sort-ascending',
        sortDescIcon: 'i-ph-sort-descending',
        sortButton: {
          icon: 'i-ph-list',
        },
        loadingState: {
          icon: 'i-ph-spinner',
        },
        emptyState: {
          icon: 'i-ph-database',
        },
      },
    },
    pagination: {
      default: {
        prevButton: {
          icon: 'i-ph-arrow-left',
        },
        nextButton: {
          icon: 'i-ph-arrow-right',
        },
      },
    },
    card: {
      rounded: 'rounded-xl',
    },
    tooltip: {
      background: '!bg-background',
      popper: {
        strategy: 'absolute',
      },
    },
    breadcrumb: {
      divider: {
        base: 'w-4 h-4',
      },
      default: {
        divider: 'i-ph-caret-right',
      },
    },
    content: {
      search: {
        fileIcon: {
          name: 'i-ph-file-text-duotone',
        },
      },
      toc: {
        button: {
          trailingIcon: {
            base: 'w-4 h-4',
          },
        },
      },
      surround: {
        icon: {
          prev: 'i-ph-arrow-left',
          next: 'i-ph-arrow-right',
        },
      },
      collapsible: {
        button: {
          icon: {
            base: 'w-3 h-3',
          },
        },
      },
      prose: {
        code: {
          button: {
            icon: {
              copy: 'i-ph-copy-duotone',
              copied: 'i-ph-check-square-duotone',
            },
          },
          icon: {
            terminal: 'i-ph-terminal-window-duotone',
          },
        },
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
    footer: [
      {
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
      },
      {
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
      },
      {
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
      },
    ],
  },
  newsletter: {
    visible: false,
    label: 'Abboniere unseren Newsletter',
    description: 'Bleibe auf dem Laufenden über neue Beiträge, Veranstaltungen und mehr.',
    placeholder: 'deine-email@domain.com',
    buttonText: 'Abonnieren',
  },
})
