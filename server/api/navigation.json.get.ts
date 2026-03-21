// This route will be pre-rendered as /api/navigation.json
import { queryCollectionNavigation } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  return Promise.all([
    queryCollectionNavigation(event, 'page'),
    queryCollectionNavigation(event, 'article'),
    queryCollectionNavigation(event, 'team'),
    queryCollectionNavigation(event, 'tournament'),
  ]).then(data => data.flat())
})
