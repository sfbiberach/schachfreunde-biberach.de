import type { LeagueMatch } from '../../shared/types/league'

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  timeZone: 'Europe/Berlin',
})

const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
})

export function formatLeagueDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00Z`))
}

export function formatLeagueDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value))
}

export function getBerlinDateKey() {
  const parts = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Berlin',
  }).formatToParts(new Date())
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function getMatchOutcome(match: LeagueMatch, teamName: string) {
  if (!match.result) {
    return null
  }

  const scores = match.result.split(':').map(score => Number.parseFloat(score.trim().replace(',', '.')))
  if (scores.length !== 2 || scores.some(Number.isNaN)) {
    return null
  }

  const [homeScore, awayScore] = scores as [number, number]
  const teamScore = match.home === teamName ? homeScore : awayScore
  const opponentScore = match.home === teamName ? awayScore : homeScore
  if (teamScore === opponentScore) {
    return 'draw'
  }
  return teamScore > opponentScore ? 'win' : 'loss'
}
