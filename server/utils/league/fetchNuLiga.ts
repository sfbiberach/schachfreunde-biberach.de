import type { H3Event } from 'h3'
import type { LeagueSource } from '../../../shared/types/league'
import { leagueSourceSchema, leagueTeamSnapshotSchema } from './schemas'

const USER_AGENT = 'schachfreunde-biberach.de/1.0 (+https://schachfreunde-biberach.de/impressum)'
const MAX_HTML_BYTES = 1_000_000

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      'accept': 'text/html,application/xhtml+xml',
      'user-agent': USER_AGENT,
    },
    signal: AbortSignal.timeout(8_000),
  })

  if (!response.ok) {
    throw new Error(`nuLiga responded with ${response.status} for ${url}`)
  }

  const contentLength = Number(response.headers.get('content-length') || 0)
  if (contentLength > MAX_HTML_BYTES) {
    throw new Error(`nuLiga response exceeds ${MAX_HTML_BYTES} bytes`)
  }

  const html = await response.text()
  if (new TextEncoder().encode(html).byteLength > MAX_HTML_BYTES) {
    throw new Error(`nuLiga response exceeds ${MAX_HTML_BYTES} bytes`)
  }

  return html
}

export async function fetchNuLigaTeam(sourceInput: LeagueSource) {
  const source = leagueSourceSchema.parse(sourceInput)
  const groupHtml = await fetchHtml(source.groupUrl)
  const teamUrl = resolveNuLigaTeamUrl(groupHtml, source)
  const teamHtml = await fetchHtml(teamUrl)

  return leagueTeamSnapshotSchema.parse(parseNuLigaTeamPage(teamHtml, source, teamUrl))
}

function sourceCacheKey(source: LeagueSource) {
  let hash = 2_166_136_261
  const value = `${source.provider}|${source.season}|${source.groupUrl}|${source.teamName}`
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16_777_619)
  }
  return Math.abs(hash >>> 0).toString(36)
}

export const getCachedLeagueTeam = defineCachedFunction(
  async (_event: H3Event, source: LeagueSource) => fetchNuLigaTeam(source),
  {
    name: 'nuliga-team',
    maxAge: 6 * 60 * 60,
    swr: true,
    getKey: (_event: H3Event, source: LeagueSource) => sourceCacheKey(source),
  },
)
