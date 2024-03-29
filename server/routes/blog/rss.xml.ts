import { Feed } from 'feed'
import { joinURL } from 'ufo'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  console.log('/rss.xml')
  const baseUrl = 'http://sf-biberach.nuxt.space'
  const siteUrl = joinURL(baseUrl, 'blog')
  const feed = new Feed({
    title: 'Schachfreunde Heilbronn-Biberach 1978 e. V.',
    description: 'Der Schachverein im Heilbronner Stadtteil Biberach.',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: joinURL(baseUrl, 'icon.png'),
    favicon: joinURL(baseUrl, 'favicon.png'),
    copyright: `Copyright © 2024-${new Date().getFullYear()} All Rights Reserved`,
    feedLinks: {
      rss: `${siteUrl}/rss.xml`,
    },
  })

  const articles = await serverQueryContent(event, '/blog')
    .sort({ date: -1 })
    .where({ _partial: false, _draft: false, _type: 'markdown' })
    .find()

  console.log(articles)

  for (const article of articles) {
    feed.addItem({
      link: joinURL(baseUrl, article._path ?? ''),
      image: joinURL(baseUrl, article.image ?? ''),
      title: article.title ?? '',
      date: new Date(article.date),
      description: article.description,
      author: article.authors,
      category: article.category,
    })
  }

  appendHeader(event, 'Content-Type', 'application/xml')
  return feed.rss2()
})
