import type { Team } from '~/types'

export function useTeams() {
  const teams = useState<Team[]>('teams', () => [])

  // Data fetching
  async function fetchList() {
    if (teams.value.length) {
      return
    }

    try {
      const data = await queryContent('/mannschaften').where({ _extension: 'md' }).find() as Team[]

      teams.value = data
    }
    catch (e) {
      teams.value = []
      return e
    }
  }

  return {
    fetchList,
    teams,
  }
}
