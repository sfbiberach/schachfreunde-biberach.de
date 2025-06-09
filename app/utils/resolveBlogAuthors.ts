import type { BlogCollectionItem } from '@nuxt/content'

export default async function resolveBlogAuthors(articles: BlogCollectionItem[]) {
  if (!Array.isArray(articles)) {
    return articles
  }

  const allAuthors = Array.from(
    new Set(
      articles.flatMap(article =>
        Array.isArray(article.authors)
          ? article.authors
          : article.authors
            ? [article.authors]
            : [],
      ),
    ),
  )
  const resolvedAuthors = await resolveAuthors(allAuthors)
  articles.forEach((article) => {
    if (article.authors) {
      const authorNames = Array.isArray(article.authors)
        ? article.authors
        : [article.authors]
      article.resolvedAuthors = resolvedAuthors.filter(a => authorNames.includes(a.name))
    }
  })
  return articles
}
