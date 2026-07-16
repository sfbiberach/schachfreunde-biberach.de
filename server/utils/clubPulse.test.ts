import type { LeagueMatch, LeagueTeamSnapshot } from '~~/shared/types/league'
import { describe, expect, it } from 'vitest'
import { buildClubPulseResponse } from './clubPulse'

function createSnapshot(name: string, matches: LeagueMatch[]): LeagueTeamSnapshot {
  return {
    schemaVersion: 1,
    sourceUrl: `https://example.com/${name}`,
    fetchedAt: '2026-07-15T10:00:00.000Z',
    season: '2026/27',
    team: { name, competition: 'Testliga' },
    players: [],
    matches,
  }
}

describe('buildClubPulseResponse', () => {
  it('selects and orders the nearest fixtures and latest results', () => {
    const response = buildClubPulseResponse({
      today: '2026-07-15',
      generatedAt: '2026-07-15T10:00:00.000Z',
      configuredTeams: 3,
      teams: [
        {
          path: '/mannschaften/mannschaft-1',
          title: '1. Mannschaft',
          snapshot: createSnapshot('SF HN-Biberach 1', [
            { id: 'old', date: '2026-07-10', home: 'A', away: 'B', status: 'finished', result: '4:4' },
            { id: 'next-2', date: '2026-07-20', home: 'A', away: 'B', status: 'scheduled' },
          ]),
        },
        {
          path: '/mannschaften/jugend-1',
          title: '1. Jugendmannschaft',
          snapshot: createSnapshot('SF HN-Biberach Jugend 1', [
            { id: 'latest', date: '2026-07-13', home: 'Biberach', away: 'C', status: 'finished', result: '5:1' },
            { id: 'next-1', date: '2026-07-18', home: 'C', away: 'Biberach', status: 'scheduled' },
            { id: 'past-scheduled', date: '2026-07-01', home: 'C', away: 'D', status: 'scheduled' },
          ]),
        },
      ],
    })

    expect(response.configuredTeams).toBe(3)
    expect(response.availableTeams).toBe(2)
    expect(response.upcomingMatches.map(entry => entry.match.id)).toEqual(['next-1', 'next-2'])
    expect(response.recentMatches.map(entry => entry.match.id)).toEqual(['latest', 'old'])
    expect(response.recentMatches[0]?.team.path).toBe('/mannschaften/jugend-1')
  })

  it('returns an empty pulse when no league source is available', () => {
    expect(buildClubPulseResponse({
      teams: [],
      today: '2026-07-15',
      generatedAt: '2026-07-15T10:00:00.000Z',
    })).toMatchObject({
      configuredTeams: 0,
      availableTeams: 0,
      upcomingMatches: [],
      recentMatches: [],
    })
  })
})
