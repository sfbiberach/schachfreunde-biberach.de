// This route will be pre-rendered as /api/navigation.json
import { queryCollectionNavigation } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  return Promise.all([
    queryCollectionNavigation(event, 'page'),
    queryCollectionNavigation(event, 'article')
      .where('status', '=', 'published')
      .order('date', 'DESC'),
    queryCollectionNavigation(event, 'team')
      .where('status', '=', 'published'),
    queryCollectionNavigation(event, 'tournament')
      .where('status', '=', 'published'),
  ]).then(data => data.flat())
})
