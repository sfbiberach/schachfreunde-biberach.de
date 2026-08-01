import type { Ref } from 'vue'
import type { SiteSocialKind, SiteSocialSource } from '~~/shared/utils/siteSocialCard'
import {
  createSiteCardProps,
  createSiteSocialAlt,
  resolveSiteSocialFormat,
  siteSocialDimensions,
} from '~~/shared/utils/siteSocialCard'

interface UseSiteOgImageOptions {
  kind: SiteSocialKind
  eyebrow?: string
}

export function useSiteOgImage<T extends SiteSocialSource>(
  page: Ref<T | null | undefined>,
  options: UseSiteOgImageOptions,
) {
  const route = useRoute()
  const requestedFormat = import.meta.dev
    ? Array.isArray(route.query.__socialFormat)
      ? route.query.__socialFormat[0]
      : route.query.__socialFormat
    : undefined
  const format = resolveSiteSocialFormat(requestedFormat)
  const source = page.value
  const card = createSiteCardProps(source, { ...options, format })
  const dimensions = siteSocialDimensions[format]
  const alt = createSiteSocialAlt(source)

  defineOgImage('SiteCard', card, {
    ...dimensions,
    alt,
    extension: 'png',
    key: format,
  })

  useSeoMeta({
    ogLocale: 'de_DE',
    ogType: options.kind === 'article' ? 'article' : 'website',
    twitterCard: 'summary_large_image',
  })

  return { alt, card, dimensions, format }
}
