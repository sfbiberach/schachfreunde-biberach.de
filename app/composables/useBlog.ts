import type { BadgeProps } from '#ui/types'

export interface CategoriesMap {
  [category: string]: BadgeProps
}

export interface UseBlogParams {
  page?: number
  perPage?: number
  categoriesMap?: CategoriesMap
  slug?: string
}

/**
 * Composable to fetch blog articles.
 *
 * Fetches a list of articles or a single article if a slug is provided.
 * It can handle pagination, resolve author details, and map categories to badge properties.
 */
export function useBlog({ page, perPage = 12, categoriesMap, slug }: UseBlogParams = {}) {
  const key = slug
    ? `blog:article:${slug}:${!!categoriesMap}`
    : `blog:list:${page}-${perPage}-${!!categoriesMap}`

  return useAsyncData(key, async () => {
    const q = queryCollection('blog')

    if (slug) {
      q.where('path', 'LIKE', `/blog/%/${slug}`)
    }
    else {
      q.where('status', '=', 'published').order('date', 'DESC')

      if (typeof page === 'number') {
        const take = perPage
        const skip = (page - 1) * take
        q.skip(skip).limit(take)
      }
    }

    let fetchedItems = await q.all()
    if (!Array.isArray(fetchedItems)) {
      fetchedItems = fetchedItems ? [fetchedItems] : []
    }

    let itemsWithResolvedAuthors = fetchedItems
    if (itemsWithResolvedAuthors?.length > 0) {
      const authorNames = [
        ...new Set(
          itemsWithResolvedAuthors.flatMap(article =>
            (article.authors || []).filter((author): author is string => typeof author === 'string'),
          ),
        ),
      ]

      if (authorNames.length > 0) {
        const fetchedAuthors = await resolveAuthors(authorNames)

        if (fetchedAuthors && fetchedAuthors.length > 0) {
          itemsWithResolvedAuthors = itemsWithResolvedAuthors.map((article) => {
            if (article.authors) {
              const resolvedAuthors = article.authors.map((authorOrName) => {
                if (typeof authorOrName === 'string') {
                  const foundAuthor = fetchedAuthors.find(fa => fa.name === authorOrName)
                  return foundAuthor || { name: authorOrName }
                }
                return authorOrName
              })
              return { ...article, resolvedAuthors }
            }
            return article
          })
        }
      }
    }

    // Process categories and ensure all items have a consistent shape
    const processedItems = itemsWithResolvedAuthors.map((article) => {
      let resolvedBadge: BadgeProps | undefined
      if (categoriesMap && article && typeof article.category === 'string' && categoriesMap[article.category]) {
        resolvedBadge = categoriesMap[article.category]
      }
      return { ...article, resolvedBadge }
    })

    if (slug) {
      return processedItems.length > 0 ? processedItems[0] : null
    }

    return processedItems
  })
}
