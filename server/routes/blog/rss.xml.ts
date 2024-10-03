import { serverQueryContent } from '#content/server'
import { Feed } from 'feed'
import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const baseUrl = 'http://sf-biberach.nuxt.space'
  const siteUrl = joinURL(baseUrl, 'blog')
  const feed = new Feed({
    title: 'Schachfreunde Heilbronn-Biberach Blog',
    description: 'Die neuesten Mannschafts- und Turnierberichte von den Schachfreunden Heilbronn-Biberach.',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: joinURL(baseUrl, 'icon.svg'),
    favicon: joinURL(baseUrl, 'favicon.ico'),
    copyright: `Copyright © 2024-${new Date().getFullYear()} All Rights Reserved`,
    feedLinks: {
      rss: `${siteUrl}/rss.xml`,
    },
  })

  const articles = await serverQueryContent(event, '/blog')
    .sort({ date: -1 })
    .where({ _partial: false, _draft: false, _type: 'markdown' })
    .find()

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
