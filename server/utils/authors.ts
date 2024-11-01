import type { Author, BlogArticle } from '~~/types'
import type { EventHandlerRequest, H3Event } from 'h3'
import { serverQueryContent } from '#content/server'

/**
 * Fetches author details based on an array of author names on the server side.
 *
 * @param names Array of author names (strings).
 * @param event Event context passed from the server handler.
 * @returns Array of author objects with details.
 */
export async function fetchAuthorsByName(names: string[], event: H3Event<EventHandlerRequest>) {
  if (names.length === 0) {
    return []
  }

  const authors = await serverQueryContent(event, '_users')
    .where({ name: { $in: names } })
    .only(['title', 'name', 'to', 'avatar'])
    .find() as Author[]

  return authors
}

/**
 * Replaces author strings in articles with corresponding author objects.
 *
 * @param articles Array of articles with authors (strings or objects).
 * @param authors Array of author objects with details.
 * @returns Updated articles with authors replaced by corresponding author objects.
 */
export function replaceAuthorStringsInArticles(articles: BlogArticle[], authors: Author[]) {
  articles.forEach((article) => {
    if (article.authors) {
      article.authors = article.authors.map(authorName =>
        authors.find(author => author.title === authorName) || authorName, // Replace or fallback to the original string
      )
    }
  })

  return articles
}
