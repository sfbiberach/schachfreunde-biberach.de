import { serverQueryContent } from '#content/server'
import type { BlogArticle } from '~/types'

export default eventHandler(async (event) => {
  const _path = getQuery(event)._path as string | undefined

  const where: { _type: string, _path?: string } = { _type: 'markdown' }
  if (_path !== undefined)
    where._path = _path

  const articles = await serverQueryContent<BlogArticle>(event, 'blog').where(where).sort({ date: -1 }).find()
  const authors = await serverQueryContent(event, '_users').only(['title', 'name', 'to', 'avatar']).find()

  articles.forEach((article) => {
    if (article.authors) {
      for (let i = 0; i < (article.authors?.length ?? 0); i++) {
        const authorName = article.authors[i]
        article.authors[i] = authors.find(author => author.title === authorName)
      }
    }
  })

  return articles
})
