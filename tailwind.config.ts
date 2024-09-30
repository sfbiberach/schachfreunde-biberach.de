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
    // Nuxt UI Card
    'top-2',
    'right-2',
    'text-[--color-light]',
    'dark:text-[--color-dark]',
    'hover:ring-[--color-light]',
    'dark:hover:ring-[--color-dark]',
    // BlogArticle
    'lg:py-8',
    'space-y-3',
  ],
}
