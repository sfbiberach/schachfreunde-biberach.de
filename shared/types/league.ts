export interface LeagueSource {
  provider: 'nuliga'
  season: string
  groupUrl: string
  teamName: string
}

export interface LeaguePlayer {
  board: string
  name: string
  rating?: number
  role: 'starter' | 'reserve'
  appearances?: number
  boardPoints?: string
}

export interface LeagueMatch {
  id: string
  date: string
  time?: string
  round?: string
  home: string
  away: string
  status: 'scheduled' | 'finished'
  result?: string
  reportUrl?: string
}

export interface LeagueTeamSnapshot {
  schemaVersion: 1
  sourceUrl: string
  fetchedAt: string
  season: string
  team: {
    name: string
    competition?: string
  }
  players: LeaguePlayer[]
  matches: LeagueMatch[]
}
