import { describe, expect, it } from 'vitest'
import {
  createSiteCardProps,
  createSiteSocialAlt,
  resolveSiteSocialFormat,
  siteSocialDimensions,
} from '../shared/utils/siteSocialCard'

describe('site social cards', () => {
  it('defines the three supported output sizes', () => {
    expect(siteSocialDimensions).toEqual({
      og: { width: 1200, height: 630 },
      square: { width: 1080, height: 1080 },
      portrait: { width: 1080, height: 1350 },
    })
    expect(resolveSiteSocialFormat('portrait')).toBe('portrait')
    expect(resolveSiteSocialFormat('unsupported')).toBe('og')
  })

  it('maps a youth article with its explicit image and date', () => {
    const card = createSiteCardProps({
      title: 'Biber-Jugend-Cup',
      description: 'Ein Turnierbericht aus der Jugendarbeit.',
      category: 'Jugend',
      date: '2026-03-17',
      image: { src: '/article.jpg', alt: 'Jugendliche beim Schach', position: 'center top' },
    }, { kind: 'article', format: 'og' })

    expect(card).toMatchObject({
      accent: '#f97316',
      accentName: 'jugend',
      eyebrow: 'Jugend',
      image: '/article.jpg',
      imageAlt: 'Jugendliche beim Schach',
      imagePosition: 'center top',
      meta: '17. März 2026',
    })
  })

  it('maps team and tournament metadata', () => {
    const team = createSiteCardProps({
      title: '1. Mannschaft',
      league: { season: '2025/26' },
    }, { kind: 'team' })
    const tournament = createSiteCardProps({
      title: 'Biber-Jugend-Cup',
      date: '2027-03-06',
      dateEnd: '2027-03-06',
      location: { name: 'Böllingertalhalle' },
    }, { kind: 'tournament' })

    expect(team).toMatchObject({ accentName: 'mannschaft', meta: 'Saison 2025/26' })
    expect(tournament.meta).toBe('6. März 2027 · Böllingertalhalle')
  })

  it('never promotes generic page images and provides accessible fallback text', () => {
    const source = { title: 'Kontakt', image: { src: '/not-a-cover.jpg' } }
    const card = createSiteCardProps(source, { kind: 'page' })

    expect(card.image).toBeUndefined()
    expect(card.eyebrow).toBe('Verein')
    expect(createSiteSocialAlt(source)).toBe('Kontakt – Schachfreunde Heilbronn-Biberach')
  })

  it('keeps long copy inside the template limits', () => {
    const card = createSiteCardProps({
      title: 'Ein sehr langer Titel '.repeat(10),
      description: 'Eine sehr lange Beschreibung '.repeat(20),
    }, { kind: 'article', format: 'og' })

    expect(card.title.length).toBeLessThanOrEqual(92)
    expect(card.description.length).toBeLessThanOrEqual(155)
    expect(card.title.endsWith('…')).toBe(true)
  })
})
