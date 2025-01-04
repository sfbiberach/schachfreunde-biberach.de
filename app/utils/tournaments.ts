import type { Tournament } from '~/types'

export function getTournamentDate(tournament: Tournament | undefined) {
  if (!tournament) {
    return ''
  }

  if (tournament.date === tournament.dateEnd || !tournament.dateEnd) {
    return new Date(tournament.date).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return `${new Date(tournament.date).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' })} - ${new Date(tournament.dateEnd).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' })}`
}
