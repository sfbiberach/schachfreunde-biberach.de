import type { Config } from 'tailwindcss'

export default <Partial<Config>> {
  content: [
    'docs/content/**/*.md',
  ],
  theme: {
    extend: {
      // https://uicolors.app/create
      colors: {
        red: {
          50: '#FFEEF2',
          100: '#FFDAE2',
          200: '#FFBBC9',
          300: '#FF8BA3',
          400: '#FF496F',
          500: '#FF1143',
          600: '#FF0036',
          700: '#E70031',
          800: '#BE0028',
          900: '#770019',
          950: '#560012',
        },
      },
    },
  },
}
