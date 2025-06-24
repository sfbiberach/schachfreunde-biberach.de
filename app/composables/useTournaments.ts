export function useTournaments() {
  return useAsyncData(
    'tournament',
    () => queryCollection('tournament').all(),
  )
}
