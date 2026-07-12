import type { LeagueSource } from '../shared/types/league'
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { parseNuLigaTeamPage, resolveNuLigaTeamUrl } from '../server/utils/league/parseNuLiga'

const source: LeagueSource = {
  provider: 'nuliga',
  season: '2025/26',
  groupUrl: 'https://svw-schach.liga.nu/cgi-bin/WebObjects/nuLigaSCHACHDE.woa/wa/groupPage?group=4211',
  teamName: 'SF HN-Biberach 1',
}

const fixture = (name: string) => readFile(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')

describe('nuLiga parser', () => {
  it('resolves the exact team portrait from a group page', async () => {
    const url = resolveNuLigaTeamUrl(await fixture('nuliga-group.html'), source)
    expect(url).toBe('https://svw-schach.liga.nu/cgi-bin/WebObjects/nuLigaSCHACHDE.woa/wa/teamPortrait?teamtable=101&group=4211')
  })

  it('parses matches and players into the public snapshot contract', async () => {
    const sourceUrl = 'https://svw-schach.liga.nu/cgi-bin/WebObjects/nuLigaSCHACHDE.woa/wa/teamPortrait?teamtable=101&group=4211'
    const snapshot = parseNuLigaTeamPage(await fixture('nuliga-team.html'), source, sourceUrl, '2026-07-12T10:00:00.000Z')

    expect(snapshot.team).toEqual({ name: 'SF HN-Biberach 1', competition: 'Oberliga Württemberg' })
    expect(snapshot.matches).toEqual([
      expect.objectContaining({ id: '7001', date: '2025-09-28', time: '10:00', status: 'finished', result: '3,5 : 4,5' }),
      expect.objectContaining({ date: '2025-10-19', status: 'scheduled' }),
    ])
    expect(snapshot.players).toEqual([
      { board: '1', name: 'Mustermann, Erika', rating: 2050, role: 'starter', appearances: 3, boardPoints: '2,0 : 1,0' },
      { board: '9', name: 'Beispiel, Alex', role: 'reserve', appearances: 1, boardPoints: '0,5 : 0,5' },
    ])
    expect(snapshot.players[0]).not.toHaveProperty('memberNumber')
  })

  it('fails closed when the configured team is missing', async () => {
    const groupHtml = await fixture('nuliga-group.html')
    expect(() => resolveNuLigaTeamUrl(groupHtml, {
      ...source,
      teamName: 'Nicht vorhanden',
    })).toThrow('nuLiga team not found')
  })
})
