import type { ParsedContent } from '@nuxt/content'

export interface Tournament extends ParsedContent {
  title: string
  description: string
  fullDescription: string
  _path: string
  date: string
  dateEnd: string
  location: string
  x: string
  instagram: string
  link: string
  external: boolean
}
