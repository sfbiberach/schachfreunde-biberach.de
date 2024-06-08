import { serverQueryContent } from '#content/server'
import type { BlogArticle } from '~/types'

export default eventHandler(async (event) => {
  const _path = `/blog/${getRouterParam(event, '_path') ?? ''}`

  const article = await serverQueryContent<BlogArticle>(event, 'blog').where({ _type: 'markdown', _path }).findOne()

  if (article) {
    article.surround = await serverQueryContent<BlogArticle>(event, 'blog').where({ _type: 'markdown' }).without(['body', 'excerpt']).sort({ date: -1 }).findSurround(_path)

    const authorStrings = article.authors?.filter(author => typeof author === 'string') ?? []
    const authors = await serverQueryContent(event, '_users').where({ title: { $in: authorStrings } }).only(['title', 'name', 'to', 'avatar']).find()

    if (article.authors) {
      for (let i = 0; i < (article.authors?.length ?? 0); i++) {
        const authorName = article.authors[i]
        article.authors[i] = authors.find(author => author.title === authorName)
      }
    }
  }

  return article
})
