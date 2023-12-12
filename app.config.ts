export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'zinc',
  },
  app: {
    headerLinks: [
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
  },
})
