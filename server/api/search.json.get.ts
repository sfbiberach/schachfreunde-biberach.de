// This route will be pre-rendered as /api/search.json
import { queryCollectionSearchSections } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  return Promise.all([
    queryCollectionSearchSections(event, 'article'),
    queryCollectionSearchSections(event, 'team'),
    queryCollectionSearchSections(event, 'tournament'),
  ]).then(data => data.flat())
})
