export function useTeam(path: string) {
  return useAsyncData(
    `team:${path}`,
    () => queryCollection('team').path(path).first(),
  )
}
