import type { BlogArticle } from '~~/types'
import { serverQueryContent } from '#content/server'

export default eventHandler(async (event) => {
  const _path = getQuery(event)._path as string | undefined

  const where: { _type: string, _path?: string } = { _type: 'markdown' }
  if (_path !== undefined)
    where._path = _path

  const articles = await serverQueryContent<BlogArticle>(event, 'blog/article').where(where).sort({ date: -1 }).find()
  if (_path) {
    await Promise.all(articles.map(async (article) => {
      if (article._path)
        article.surround = await serverQueryContent<BlogArticle>(event, 'blog/article').where({ _type: 'markdown' }).without(['body', 'excerpt']).sort({ date: -1 }).findSurround(article._path)
    }))
  }

  const authorStrings = [...new Set(articles.flatMap(article => article.authors?.filter(author => typeof author === 'string') ?? []))]
  const authors = await serverQueryContent(event, '_users').where({ title: { $in: authorStrings } }).only(['title', 'name', 'to', 'avatar']).find()

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
