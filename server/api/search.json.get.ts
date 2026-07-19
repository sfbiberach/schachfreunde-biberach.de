// This route will be pre-rendered as /api/search.json
import { queryCollectionSearchSections } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  return Promise.all([
    queryCollectionSearchSections(event, 'page'),
    queryCollectionSearchSections(event, 'article')
      .where('status', '=', 'published'),
    queryCollectionSearchSections(event, 'team')
      .where('status', '=', 'published'),
    queryCollectionSearchSections(event, 'tournament')
      .where('status', '=', 'published'),
  ]).then(data => data.flat())
})
