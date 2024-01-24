export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'zinc',
  },
  links: {
    header: [
      {
        label: 'Aktuelles',
        icon: 'i-ph-newspaper-duotone',
        to: '/',
      },
      {
        label: 'Verein',
        icon: 'i-ph-horse-duotone',
        to: '/verein',
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
        label: 'Aktuelles',
        to: '/',
      }, {
        label: 'Verein',
        to: '/verein',
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
