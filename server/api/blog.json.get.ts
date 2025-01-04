import type { BlogArticle } from '~/types'
import { serverQueryContent } from '#content/server'
import { BLOG_PATHS } from '~~/constants/blog'
import { fetchAuthorsByName, replaceAuthorStringsInArticles } from '../utils/authors'

/**
 * Handles fetching blog articles, optionally by a specific path, and enriches them
 * with author details and surrounding articles (if applicable).
 *
 * @param event - The incoming HTTP request event.
 * @returns {BlogArticle[]} - An array of enriched blog articles.
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
  const articles = await serverQueryContent<BlogArticle>(event, BLOG_PATHS.ARTICLES)
    .where(where)
    .sort({ date: -1 })
    .find()

  // If a specific article path is queried, find the surrounding articles
  if (_path) {
    await Promise.all(
      articles.map(async (article) => {
        if (article._path) {
          // Find surrounding articles (previous and next)
          article.surround = await serverQueryContent<BlogArticle>(event, BLOG_PATHS.ARTICLES)
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
  const authors = await fetchAuthorsByName(authorStrings, event)

  // Replace author strings in articles with the corresponding author object
  replaceAuthorStringsInArticles(articles, authors)

  // Return the enriched list of articles with author details and surrounding articles
  return articles
})
