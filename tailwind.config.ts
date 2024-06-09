import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>> {
  content: ['./content/**/*.{md,json,yaml,yml,csv}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Lato', ...defaultTheme.fontFamily.sans],
        serif: ['Inter', 'Lora', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  safelist: [
    'xl:col-span-3',
    'sm:block',
    'i-heroicons-arrow-right-20-solid',
    'i-heroicons-arrow-left-20-solid',
  ],
}
