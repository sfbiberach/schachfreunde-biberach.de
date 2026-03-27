import type { BadgeProps } from '#ui/types'

interface CategoriesMap {
  [category: string]: BadgeProps
}

export interface UseBlogArticleParams {
  slug: string
  categoriesMap?: CategoriesMap
}

/**
 * Composable to fetch a single blog article by slug.
 * Returns a single article for the given slug.
 */
export function useBlogArticle(options: UseBlogArticleParams) {
  const { slug } = options
  return useAsyncData(
    `blog-${slug}`,
    () => queryCollection('article').path(`/blog/article/${slug}`).first(),
  )
}
