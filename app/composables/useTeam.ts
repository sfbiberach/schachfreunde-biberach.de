export function useTeam(path: string) {
  return useAsyncData(
    `teams:${path}`,
    () => queryCollection('team').path(path).first(),
  )
}
