// This route will be pre-rendered as /api/search.json
import { queryCollectionSearchSections } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  return Promise.all([
    queryCollectionSearchSections(event, 'page'),
    queryCollectionSearchSections(event, 'article')
      .where('published', '=', true),
    queryCollectionSearchSections(event, 'team')
      .where('published', '=', true),
    queryCollectionSearchSections(event, 'tournament')
      .where('published', '=', true),
  ]).then(data => data.flat())
})
