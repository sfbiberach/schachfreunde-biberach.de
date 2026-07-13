import { describe, expect, it } from 'vitest'
import { isLeagueSnapshotStale, LEAGUE_CACHE_MAX_AGE_MS } from '../shared/constants/league'

describe('league cache freshness', () => {
  const fetchedAt = '2026-07-13T08:00:00.000Z'
  const fetchedAtTime = Date.parse(fetchedAt)

  it('keeps snapshots fresh until the cache age is reached', () => {
    expect(isLeagueSnapshotStale(fetchedAt, fetchedAtTime + LEAGUE_CACHE_MAX_AGE_MS - 1)).toBe(false)
  })

  it('revalidates snapshots at the cache age boundary', () => {
    expect(isLeagueSnapshotStale(fetchedAt, fetchedAtTime + LEAGUE_CACHE_MAX_AGE_MS)).toBe(true)
  })

  it('revalidates snapshots with an invalid timestamp', () => {
    expect(isLeagueSnapshotStale('invalid', fetchedAtTime)).toBe(true)
  })
})
