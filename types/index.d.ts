import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

export interface BlogArticle extends ParsedContent {
  title: string
  description: string
  date: string
  image?: HTMLImageElement
  category?: Badge
  authors?: ({
    name: string
    description?: string
    avatar?: Avatar
  } & Link)[]
}
