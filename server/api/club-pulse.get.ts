import type { LeagueSource } from '~~/shared/types/league'
import type { ClubPulseTeamInput } from '../utils/clubPulse'
import { queryCollection } from '@nuxt/content/server'

function getBerlinDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export default defineEventHandler(async (event) => {
  const pages = await queryCollection(event, 'team')
    .where('status', '=', 'published')
    .select('path', 'title', 'league', 'status')
    .all()

  const configuredPages = pages.filter(page => page.league)
  const snapshots = await Promise.allSettled(
    configuredPages.map(page => getCachedLeagueTeam(event, page.league as LeagueSource)),
  )

  const teams = snapshots.reduce<ClubPulseTeamInput[]>((result, settled, index) => {
    const page = configuredPages[index]
    if (settled.status === 'fulfilled' && page) {
      result.push({
        path: page.path,
        title: page.title,
        snapshot: settled.value,
      })
    }
    return result
  }, [])

  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=21600')

  return buildClubPulseResponse({
    teams,
    configuredTeams: configuredPages.length,
    today: getBerlinDateKey(),
    generatedAt: new Date().toISOString(),
  })
})
