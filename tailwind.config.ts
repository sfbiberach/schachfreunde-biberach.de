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
}
