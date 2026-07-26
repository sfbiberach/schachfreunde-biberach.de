// This route will be pre-rendered as /api/navigation.json
import { queryCollectionNavigation } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  return Promise.all([
    queryCollectionNavigation(event, 'page'),
    queryCollectionNavigation(event, 'article')
      .where('published', '=', true)
      .order('date', 'DESC'),
    queryCollectionNavigation(event, 'team')
      .where('published', '=', true),
    queryCollectionNavigation(event, 'tournament')
      .where('published', '=', true),
  ]).then(data => data.flat())
})
