import type { BlogArticle } from '~~/types'
import { serverQueryContent } from '#content/server'

/**
 * Handles fetching blog articles, optionally by a specific path, and enriches them
 * with author details and surrounding articles (if applicable).
 *
 * @param {H3Event} event - The incoming HTTP request event.
 * @returns {Promise<BlogArticle[]>} - A promise that resolves to an array of enriched blog articles.
 *
 * - If a specific article path (_path) is provided in the query, surrounding articles are fetched.
 * - Author strings are replaced with full author details (name, avatar, etc.).
 */
export default defineEventHandler(async (event) => {
  // Get the query parameter for the specific article path if provided
  const _path = getQuery(event)._path as string | undefined

  // Build the query filter, including _path only if it's defined
  const where: { _type: string, _path?: string } = {
    _type: 'markdown',
    ...(_path && { _path }), // Conditionally add _path to filter
  }

  // Fetch articles, sorted by date in descending order
  const articles = await serverQueryContent<BlogArticle>(event, 'blog/article')
    .where(where)
    .sort({ date: -1 })
    .find()

  // If a specific article path is queried, find the surrounding articles
  if (_path) {
    await Promise.all(
      articles.map(async (article) => {
        if (article._path) {
          // Find surrounding articles (previous and next)
          article.surround = await serverQueryContent<BlogArticle>(event, 'blog/article')
            .where({ _type: 'markdown' })
            .without(['body', 'excerpt']) // Exclude unnecessary fields for efficiency
            .sort({ date: -1 })
            .findSurround(article._path)
        }
      }),
    )
  }

  // Extract unique author names from articles
  const authorStrings = [...new Set(articles.flatMap(article =>
    article.authors?.filter(author => typeof author === 'string') || [], // Handle undefined authors array safely
  ))]

  // Fetch author details for the extracted author names
  const authors = await serverQueryContent(event, '_users')
    .where({ title: { $in: authorStrings } }) // Filter by author titles
    .only(['title', 'name', 'to', 'avatar']) // Fetch only necessary fields to optimize query
    .find()

  // Replace author strings in articles with the corresponding author object
  articles.forEach((article) => {
    if (article.authors) {
      // Map author names to corresponding author details
      article.authors = article.authors.map(authorName =>
        authors.find(author => author.title === authorName) || authorName, // Fallback to original name if not found
      )
    }
  })

  // Return the enriched list of articles with author details and surrounding articles
  return articles
})
