export function useTournament(path: string) {
  return useAsyncData(
    `tournament:${path}`,
    () => queryCollection('tournament').path(path).first(),
  )
}
