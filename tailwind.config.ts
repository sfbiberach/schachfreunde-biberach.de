import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>> {
  content: [
    'docs/content/**/*.md',
  ],
  theme: {
    extend: {
      // https://uicolors.app/create
      colors: {
        appBlue: {
          50: '#f2f8fd',
          100: '#e3f0fb',
          200: '#c1e2f6',
          300: '#8ac9ef',
          400: '#4caee4',
          500: '#2594d2',
          600: '#1982c4',
          700: '#145e90',
          800: '#145078',
          900: '#164364',
          950: '#0f2c42',
        },
        appGun: {
          50: '#f3f8f8',
          100: '#e1ebec',
          200: '#c6d9db',
          300: '#9ebec2',
          400: '#6f9ba1',
          500: '#537f87',
          600: '#486a72',
          700: '#3f585f',
          800: '#394b51',
          900: '#334146',
          950: '#253237',
        },
        appRed: {
          50: '#fef2f2',
          100: '#ffe1e1',
          200: '#ffc9c9',
          300: '#fea3a3',
          400: '#fb6f6e',
          500: '#f24241',
          600: '#d8201f',
          700: '#bc1a19',
          800: '#9b1a19',
          900: '#811c1b',
          950: '#460909',
        },
        appClay: {
          50: '#f4f6fa',
          100: '#e6eaf3',
          200: '#d3daea',
          300: '#b4c1dc',
          400: '#90a2ca',
          500: '#7686bb',
          600: '#636fad',
          700: '#58609d',
          800: '#4c5081',
          900: '#404468',
          950: '#2b2d42',
        },

      },
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
        serif: ['Lora', ...defaultTheme.fontFamily.serif],
      },
    },
  },
}
