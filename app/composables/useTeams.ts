export function useTeams() {
  return useAsyncData(
    'teams',
    () => queryCollection('team').all(),
  )
}
