export type SiteSocialKind = 'landing' | 'page' | 'article' | 'tournament' | 'team'
export type SiteSocialFormat = 'og' | 'square' | 'portrait'
export type SiteSocialAccent = 'verein' | 'jugend' | 'mannschaft'

export interface SiteSocialImage {
  src: string
  alt?: string
  position?: string
}

export interface SiteSocialSource {
  title?: string
  description?: string
  category?: string
  date?: string | Date
  dateEnd?: string | Date
  location?: string | { name?: string }
  league?: { season?: string }
  image?: SiteSocialImage
}

export interface SiteSocialOptions {
  kind: SiteSocialKind
  eyebrow?: string
  format?: SiteSocialFormat
}

export interface SiteCardProps {
  accent: string
  accentName: SiteSocialAccent
  description: string
  eyebrow: string
  format: SiteSocialFormat
  image?: string
  imageAlt?: string
  imagePosition?: string
  meta?: string
  title: string
}

export const siteSocialDimensions: Record<SiteSocialFormat, { width: number, height: number }> = {
  og: { width: 1200, height: 630 },
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
}

const accentColors: Record<SiteSocialAccent, string> = {
  verein: '#3b82f6',
  jugend: '#f97316',
  mannschaft: '#22c55e',
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function resolveSiteSocialFormat(value: unknown): SiteSocialFormat {
  return value === 'square' || value === 'portrait' ? value : 'og'
}

export function createSiteCardProps(source: SiteSocialSource | null | undefined, options: SiteSocialOptions): SiteCardProps {
  const format = options.format || 'og'
  const accentName = resolveAccent(options.kind, source?.category)
  const title = cleanText(source?.title) || 'Schachfreunde Heilbronn-Biberach'
  const description = truncateText(
    cleanText(source?.description) || 'Schach, Gemeinschaft und Nachwuchsarbeit im Heilbronner Stadtteil Biberach.',
    format === 'og' ? 155 : 190,
  )
  const image = options.kind === 'article' && source?.image?.src
    ? source.image
    : undefined

  return {
    accent: accentColors[accentName],
    accentName,
    description,
    eyebrow: options.eyebrow || resolveEyebrow(options.kind, source?.category),
    format,
    image: image?.src,
    imageAlt: image?.alt,
    imagePosition: image?.position || 'center',
    meta: resolveMeta(source, options.kind),
    title: truncateText(title, format === 'og' ? 92 : 110),
  }
}

export function createSiteSocialAlt(source: SiteSocialSource | null | undefined) {
  const title = cleanText(source?.title) || 'Schachfreunde Heilbronn-Biberach'
  return `${title} – Schachfreunde Heilbronn-Biberach`
}

function resolveAccent(kind: SiteSocialKind, category?: string): SiteSocialAccent {
  const normalized = category?.toLocaleLowerCase('de-DE')
  if (kind === 'team' || normalized?.includes('mannschaft')) {
    return 'mannschaft'
  }
  if (normalized?.includes('jugend')) {
    return 'jugend'
  }
  return 'verein'
}

function resolveEyebrow(kind: SiteSocialKind, category?: string) {
  if (kind === 'landing') {
    return 'Schachverein'
  }
  if (kind === 'article') {
    return category || 'Aktuelles'
  }
  if (kind === 'tournament') {
    return 'Turnier'
  }
  if (kind === 'team') {
    return 'Mannschaft'
  }
  return 'Information'
}

function resolveMeta(source: SiteSocialSource | null | undefined, kind: SiteSocialKind) {
  if (kind === 'team' && source?.league?.season) {
    return `Saison ${source.league.season}`
  }

  if (kind === 'tournament') {
    return [formatDateRange(source?.date, source?.dateEnd), resolveLocation(source?.location)]
      .filter(Boolean)
      .join(' · ') || undefined
  }

  if (kind === 'article') {
    return formatDate(source?.date)
  }

  return undefined
}

function resolveLocation(location?: SiteSocialSource['location']) {
  if (typeof location === 'string') {
    return cleanText(location)
  }
  return cleanText(location?.name)
}

function formatDateRange(start?: string | Date, end?: string | Date) {
  const startText = formatDate(start)
  const endText = formatDate(end)
  if (!startText) {
    return endText
  }
  if (!endText || startText === endText) {
    return startText
  }
  return `${startText} – ${endText}`
}

function formatDate(value?: string | Date) {
  if (!value) {
    return undefined
  }
  const date = value instanceof Date ? value : new Date(`${value}T12:00:00Z`)
  return Number.isNaN(date.getTime()) ? undefined : dateFormatter.format(date)
}

function cleanText(value?: string) {
  return value?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncateText(value: string, maximum: number) {
  if (value.length <= maximum) {
    return value
  }
  const shortened = value.slice(0, maximum - 1)
  const wordBoundary = shortened.lastIndexOf(' ')
  return `${shortened.slice(0, wordBoundary > maximum * 0.65 ? wordBoundary : undefined).trim()}…`
}
