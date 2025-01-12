import type { Tournament } from '~/types'

export function useTournaments() {
  const tournaments = useState<Tournament[]>('tournaments', () => [])

  // Data fetching
  async function fetchList() {
    if (tournaments.value.length) {
      return
    }

    try {
      const data = await queryContent('/turniere').where({ _extension: 'md' }).find() as Tournament[]

      tournaments.value = data
    }
    catch (e) {
      tournaments.value = []
      return e
    }
  }

  return {
    fetchList,
    tournaments,
  }
}
