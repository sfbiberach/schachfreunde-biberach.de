import type { ParsedContent } from '@nuxt/content'

export type Author = Pick<ParsedContent, 'name' | 'title' | 'to' | 'avatar'>

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
