import type { LeagueMatch } from './league'

export interface ClubPulseTeam {
  title: string
  name: string
  path: string
  competition?: string
  season: string
}

export interface ClubPulseTeamMatch {
  team: ClubPulseTeam
  match: LeagueMatch
}

export interface ClubPulseResponse {
  generatedAt: string
  configuredTeams: number
  availableTeams: number
  upcomingMatches: ClubPulseTeamMatch[]
  recentMatches: ClubPulseTeamMatch[]
}
