// @ts-check
import antfu from '@antfu/eslint-config'
import { mdcLint } from 'mdclint'
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
    {
      name: 'nuxt-studio/md/rules',
      files: ['**/*.md'],
      rules: {
        'no-irregular-whitespace': ['off'],
      },
    },
    {
      name: 'happydesigns/stylistic/rules',
      rules: {
        'curly': ['error', 'all'],
        'style/brace-style': ['error', 'stroustrup'],
      },
    },
  ).append(await mdcLint({
    files: ['content/**/*.md'],
    preset: 'mdc',
    // @ts-ignore
    config: { MD013: { line_length: 2048 } },
  })),
)
