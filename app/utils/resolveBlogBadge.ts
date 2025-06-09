import type { BlogCollectionItem } from '@nuxt/content'
import resolveBadge from './resolveBadge'

/**
 * Resolves and assigns the resolvedBadge property for each blog article in the array.
 * Modifies the input array in place and returns it.
 */
export default function resolveBlogBadge(
  articles: BlogCollectionItem[],
  categoriesMap?: Record<string, any>,
) {
  if (!Array.isArray(articles)) {
    return articles
  }
  articles.forEach((article) => {
    if (article.category) {
      article.resolvedBadge = resolveBadge(article.category, categoriesMap)
    }
  })
  return articles
}
