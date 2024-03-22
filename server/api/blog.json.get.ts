import { serverQueryContent } from '#content/server'
import type { BlogArticle } from '~/types'

export default eventHandler(async (event) => {
  const articles = await serverQueryContent<BlogArticle>(event, 'blog').where({ _type: 'markdown' }).sort({ date: -1 }).find()
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
