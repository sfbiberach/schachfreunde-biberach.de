export function useTeams() {
  return useAsyncData(
    'team',
    () => queryCollection('team').all(),
  )
}
