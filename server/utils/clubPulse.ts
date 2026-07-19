import type { ClubPulseResponse } from '~~/shared/types/clubPulse'
import type { LeagueTeamSnapshot } from '~~/shared/types/league'

export interface ClubPulseTeamInput {
  path: string
  title: string
  snapshot: LeagueTeamSnapshot
}

interface BuildClubPulseOptions {
  teams: ClubPulseTeamInput[]
  today: string
  generatedAt: string
  configuredTeams?: number
  limit?: number
}

export function buildClubPulseResponse({
  teams,
  today,
  generatedAt,
  configuredTeams = teams.length,
  limit = 3,
}: BuildClubPulseOptions): ClubPulseResponse {
  const matches = teams.flatMap(({ path, title, snapshot }) => {
    const team = {
      path,
      title,
      name: snapshot.team.name,
      competition: snapshot.team.competition,
      season: snapshot.season,
    }

    return snapshot.matches.map(match => ({ team, match }))
  })

  const upcomingMatches = matches
    .filter(({ match }) => match.status === 'scheduled' && match.date >= today)
    .sort((a, b) => a.match.date.localeCompare(b.match.date) || a.team.title.localeCompare(b.team.title, 'de'))
    .slice(0, limit)

  const recentMatches = matches
    .filter(({ match }) => match.status === 'finished' && match.date <= today)
    .sort((a, b) => b.match.date.localeCompare(a.match.date) || a.team.title.localeCompare(b.team.title, 'de'))
    .slice(0, limit)

  return {
    generatedAt,
    configuredTeams,
    availableTeams: teams.length,
    upcomingMatches,
    recentMatches,
  }
}
