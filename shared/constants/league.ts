export const LEAGUE_CACHE_MAX_AGE_SECONDS = 6 * 60 * 60
export const LEAGUE_CACHE_MAX_AGE_MS = LEAGUE_CACHE_MAX_AGE_SECONDS * 1000

export function isLeagueSnapshotStale(fetchedAt: string, now = Date.now()) {
  const fetchedAtTime = Date.parse(fetchedAt)
  return !Number.isFinite(fetchedAtTime) || now - fetchedAtTime >= LEAGUE_CACHE_MAX_AGE_MS
}
