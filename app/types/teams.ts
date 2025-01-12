import type { ParsedContent } from '@nuxt/content'

export interface Team extends ParsedContent {
  title: string
  description: string
  _path: string
  location: string
  x: string
  instagram: string
  link: string
  external: boolean
}
