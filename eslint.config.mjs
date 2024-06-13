// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(
    {

    },
    {
      name: 'tailwind/yaml/rules',
      files: ['**/*.yaml', '**/*.yml'],
      rules: {
        'yaml/plain-scalar': ['off'],
      },
    },
  ),
)
