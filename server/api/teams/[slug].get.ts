import type { LeagueSource } from '../../../shared/types/league'
import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team slug is required',
    })
  }

  const page = await queryCollection(event, 'team')
    .path(`/mannschaften/${slug}`)
    .first()

  if (!page || page.status !== 'published' || !page.league) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Team league data not found',
    })
  }

  return getCachedLeagueTeam(event, page.league as LeagueSource)
})
