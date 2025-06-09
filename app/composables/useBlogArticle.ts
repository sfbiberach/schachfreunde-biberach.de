import type { BadgeProps } from '#ui/types'

export interface CategoriesMap {
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
    async () => {
      const q = queryCollection('blog')
      q.where('path', 'LIKE', `/blog/%/${slug}`)
      const result = await q.all()
      if (Array.isArray(result)) {
        return (result.length > 0 ? result[0] : null)
      }
      return result
    },
  )
}
