import type { CollectionQueryBuilder, Collections } from '@nuxt/content'
import type { H3Event } from 'h3'
import { queryCollection } from '#imports'
import { Feed } from 'feed'
import { joinURL } from 'ufo'

type queryCollectionWithEvent = <T extends keyof Collections>(event: H3Event, collection: T) => CollectionQueryBuilder<Collections[T]>

export default defineEventHandler(async (event) => {
  const protocol = getRequestProtocol(event)
  const host = getRequestHost(event)
  const baseUrl = `${protocol}://${host}`
  const siteUrl = joinURL(baseUrl, 'blog')
  const feed = new Feed({
    title: 'Schachfreunde Heilbronn-Biberach Blog',
    description: 'Die neuesten Mannschafts- und Turnierberichte von den Schachfreunden Heilbronn-Biberach.',
    id: siteUrl,
    link: siteUrl,
    language: 'de',
    // image: joinURL(baseUrl, 'icon.png'),
    favicon: joinURL(baseUrl, 'favicon.png'),
    copyright: `Copyright © 2024-${new Date().getFullYear()} All Rights Reserved`,
    feedLinks: {
      rss: `${siteUrl}/rss.xml`,
    },
  })

  const articles = await (queryCollection as queryCollectionWithEvent)(event, 'blog')
    .order('date', 'DESC')
    .all()

  for (const article of articles) {
    if (article.status !== 'published') {
      continue
    }
    feed.addItem({
      link: joinURL(baseUrl, article.path),
      // image: joinURL(baseUrl, article.image),
      title: article.title,
      date: new Date(article.date ?? 0),
      description: article.description,
      category: [{
        name: article.category,
      }],
      // author: article.authors, INF0: Cannot work without an email field in the author object https://github.com/jpmonette/feed/issues/141
    })
  }

  appendHeader(event, 'Content-Type', 'application/xml')
  return feed.rss2()
})
