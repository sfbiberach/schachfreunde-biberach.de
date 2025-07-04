import type { CategoriesMap } from '~/types'

export interface UseBlogParams {
  page?: number
  itemsPerPage?: number
  categoriesMap?: CategoriesMap
}

/**
 * Composable to fetch a list of blog articles.
 */
export function useBlogList({ page = 1, itemsPerPage = 12, categoriesMap }: UseBlogParams = {}) {
  return useAsyncData(
    `blog-list-${page}-${itemsPerPage}`,
    async () => {
      const skip = (page - 1) * itemsPerPage
      const q = queryCollection('blog')
        .where('status', '=', 'published')
        .order('date', 'DESC')
        .skip(skip)
        .limit(itemsPerPage)
      const articles = await q.all()
      await resolveBlogAuthors(articles)
      resolveBlogBadge(articles, categoriesMap)
      return articles
    },
  )
}
