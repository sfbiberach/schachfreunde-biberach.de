import type { LeagueMatch, LeaguePlayer, LeagueSource, LeagueTeamSnapshot } from '../../../shared/types/league'
import { load } from 'cheerio/slim'
import { leagueTeamSnapshotSchema } from './schemas'

const NULIGA_ORIGIN = 'https://svw-schach.liga.nu'
type Document = ReturnType<typeof load>

function normalizeText(value: string) {
  return value.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseInteger(value: string) {
  const normalized = normalizeText(value)
  return /^\d+$/.test(normalized) ? Number.parseInt(normalized, 10) : undefined
}

function parseDate(value: string) {
  const match = normalizeText(value).match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (!match) {
    throw new Error(`Unexpected nuLiga date: ${value}`)
  }

  return `${match[3]}-${match[2]}-${match[1]}`
}

function absoluteNuLigaUrl(href: string, baseUrl: string) {
  const url = new URL(href, baseUrl)
  if (url.origin !== NULIGA_ORIGIN) {
    throw new Error(`Unexpected nuLiga origin: ${url.origin}`)
  }

  return url.toString()
}

function extractMeetingId(reportUrl: string | undefined, match: Omit<LeagueMatch, 'id'>) {
  if (reportUrl) {
    const meeting = new URL(reportUrl).searchParams.get('meeting')
    if (meeting) {
      return meeting
    }
  }

  return [match.date, match.home, match.away].join(':')
}

function findMatchTable($: Document) {
  return $('table.result-set').filter((_, table) => {
    const headings = normalizeText($(table).find('th').text())
    return headings.includes('Heimmannschaft') && headings.includes('Gastmannschaft')
  }).first()
}

function parseMatches($: Document, sourceUrl: string): LeagueMatch[] {
  const table = findMatchTable($)
  if (!table.length) {
    throw new Error('nuLiga match table not found')
  }

  const matches: LeagueMatch[] = []
  table.find('tr').each((_, row) => {
    if ($(row).find('th').length) {
      return
    }

    const cells = $(row).find('td')
    if (cells.length < 9) {
      return
    }

    const dateText = normalizeText(cells.eq(1).text())
    const home = normalizeText(cells.eq(6).text())
    const away = normalizeText(cells.eq(7).text())
    if (!dateText || !home || !away) {
      return
    }

    const time = normalizeText(cells.eq(2).text()).match(/^\d{2}:\d{2}/)?.[0]
    const round = normalizeText(cells.eq(4).text()) || undefined
    const result = normalizeText(cells.eq(8).text()) || undefined
    const reportHref = cells.eq(8).find('a[title="Spielbericht"]').attr('href')
    const reportUrl = reportHref ? absoluteNuLigaUrl(reportHref, sourceUrl) : undefined
    const partial: Omit<LeagueMatch, 'id'> = {
      date: parseDate(dateText),
      time,
      round,
      home,
      away,
      status: result ? 'finished' : 'scheduled',
      result,
      reportUrl,
    }

    matches.push({
      id: extractMeetingId(reportUrl, partial),
      ...partial,
    })
  })

  return matches
}

function findPlayerTable($: Document) {
  return $('table.result-set').filter((_, table) => {
    const text = normalizeText($(table).text())
    return text.includes('Stammspieler') && text.includes('Mitgliedsnummer')
  }).first()
}

function parsePlayers($: Document): LeaguePlayer[] {
  const table = findPlayerTable($)
  if (!table.length) {
    throw new Error('nuLiga player table not found')
  }

  const players: LeaguePlayer[] = []
  let role: LeaguePlayer['role'] = 'starter'

  table.find('tr').each((_, row) => {
    const section = normalizeText($(row).find('b').text())
    if (section === 'Stammspieler') {
      role = 'starter'
      return
    }
    if (section === 'Ersatzspieler') {
      role = 'reserve'
      return
    }
    if ($(row).find('th').length) {
      return
    }

    const cells = $(row).find('td')
    if (cells.length !== 6) {
      return
    }

    const board = normalizeText(cells.eq(0).text())
    const name = normalizeText(cells.eq(1).text())
    if (!board || !name) {
      return
    }

    players.push({
      board,
      name,
      rating: parseInteger(cells.eq(3).text()),
      role,
      appearances: parseInteger(cells.eq(4).text()),
      boardPoints: normalizeText(cells.eq(5).text()) || undefined,
    })
  })

  return players
}

function parseCompetition($: Document) {
  const headingHtml = $('h1').first().html()
  if (!headingHtml) {
    return undefined
  }

  const lines = headingHtml
    .split(/<br\s*\/?>/i)
    .map(line => normalizeText(load(line).text()))
    .filter(Boolean)

  return lines.at(1)
}

export function resolveNuLigaTeamUrl(groupHtml: string, source: LeagueSource) {
  const groupUrl = new URL(source.groupUrl)
  if (groupUrl.origin !== NULIGA_ORIGIN) {
    throw new Error(`Unexpected nuLiga origin: ${groupUrl.origin}`)
  }

  const $ = load(groupHtml)
  const link = $('a[title="Mannschaftsportrait"]').filter((_, element) => {
    return normalizeText($(element).text()) === source.teamName
  }).first()
  const href = link.attr('href')
  if (!href) {
    throw new Error(`nuLiga team not found in group: ${source.teamName}`)
  }

  return absoluteNuLigaUrl(href, source.groupUrl)
}

export function parseNuLigaTeamPage(
  teamHtml: string,
  source: LeagueSource,
  sourceUrl: string,
  fetchedAt = new Date().toISOString(),
): LeagueTeamSnapshot {
  const $ = load(teamHtml)
  const snapshot: LeagueTeamSnapshot = {
    schemaVersion: 1,
    sourceUrl,
    fetchedAt,
    season: source.season,
    team: {
      name: source.teamName,
      competition: parseCompetition($),
    },
    players: parsePlayers($),
    matches: parseMatches($, sourceUrl),
  }

  return leagueTeamSnapshotSchema.parse(snapshot)
}
