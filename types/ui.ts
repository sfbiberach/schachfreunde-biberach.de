import { z } from '@nuxt/content'

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const badgeVariantEnum = z.enum(['solid', 'outline', 'soft', 'subtle'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info', 'jugend', 'mannschaft', 'verein'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])
const avatarSizeEnum = z.enum(['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']).default('md')
const orientationEnum = z.enum(['vertical', 'horizontal'])
const targetEnum = z.enum(['_blank', '_parent', '_self', '_top'])
const positionEnum = z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right'])

const as = z.any().optional()
const title = z.string().nonempty()
const description = z.string().nonempty()
const icon = z.string().optional().editor({ input: 'icon' })
const orientation = orientationEnum.optional()
const label = z.string().nonempty()
export const to = z.string().nonempty()
const headline = z.string().optional()
const size = sizeEnum.optional()
const trailing = z.boolean().optional()
const target = z.union([targetEnum, z.string()]).optional()
const color = colorEnum.optional()
const variant = variantEnum.optional()
const reverse = z.boolean().optional()
const links = z.array(createLinkSchema())
const features = z.array(createFeatureItemSchema())
const src = z.string().optional()
const alt = z.string().optional()
const text = z.string().optional()
const position = positionEnum.optional()
const inset = z.boolean().optional()
const highlight = z.boolean().optional()
const highlightColor = colorEnum.optional()
const spotlight = z.boolean().optional()
const spotlightColor = colorEnum.optional()
const square = z.boolean().optional()
const leading = z.boolean().optional()
const leadingIcon = z.string().optional()
const trailingIcon = z.string().optional()
const date = z.string().date().optional()

function createBaseSchema() {
  return z.object({
    title,
    description,
  })
}

function createFeatureItemSchema() {
  return createBaseSchema().extend({
    icon,
  })
}

function createLinkSchema() {
  return z.object({
    label,
    to,
    icon,
    size,
    trailing,
    target,
    color,
    variant,
  })
}

function createChipPropsSchema() {
  return z.object({
    as,
    text: z.union([z.string(), z.number()]).optional(),
    color,
    size,
    position,
    inset,
    standalone: z.boolean().optional(),
    class: z.any().optional(),
    ui: z.object({
      root: z.string().optional(),
      base: z.string().optional(),
    }).optional(),
  })
}

const chipSchema = z.union([
  z.boolean(),
  createChipPropsSchema(),
])

export const pageSectionSchema = createBaseSchema().extend({
  as,
  headline,
  icon,
  links,
  features,
  orientation,
  reverse,
  ui: z.object({
    root: z.string().optional(),
    container: z.string().optional(),
    wrapper: z.string().optional(),
    headline: z.string().optional(),
    leading: z.string().optional(),
    leadingIcon: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    links: z.string().optional(),
    features: z.string().optional(),
  }).optional(),
})

export const pageHeroSchema = createBaseSchema().extend({
  as,
  headline,
  links,
  orientation,
  reverse,
  ui: z.object({
    root: z.string().optional(),
    container: z.string().optional(),
    wrapper: z.string().optional(),
    headline: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    links: z.string().optional(),
  }).optional(),
})

export const pageHeaderSchema = createBaseSchema().extend({
  as,
  headline,
  links,
  ui: z.object({
    root: z.string().optional(),
    container: z.string().optional(),
    wrapper: z.string().optional(),
    headline: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    links: z.string().optional(),
  }).optional(),

})

export const cardSchema = createBaseSchema().extend({
  as,
  icon,
  orientation,
  reverse,
  highlight,
  highlightColor,
  spotlight,
  spotlightColor,
  variant,
  to,
  target,
  ui: z.object({
    root: z.string().optional(),
    spotlight: z.string().optional(),
    container: z.string().optional(),
    wrapper: z.string().optional(),
    header: z.string().optional(),
    body: z.string().optional(),
    footer: z.string().optional(),
    leading: z.string().optional(),
    leadingIcon: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
})

export const avatarSchema = z.object({
  as,
  src,
  alt,
  icon,
  text,
  size: avatarSizeEnum,
  chip: chipSchema.optional(),
  ui: z.object({
    root: z.any().optional(),
    image: z.any().optional(),
    fallback: z.any().optional(),
    icon: z.any().optional(),
  }).optional(),
}).optional()

export const badgeSchema = z.object({
  as,
  label: z.union([z.string(), z.number()]).optional(),
  color,
  variant: badgeVariantEnum.optional(),
  size,
  square,
  icon,
  avatar: avatarSchema,
  leading,
  leadingIcon,
  trailing,
  trailingIcon,
  ui: z.object({
    base: z.any().optional(),
    label: z.any().optional(),
    leadingIcon: z.any().optional(),
    leadingAvatar: z.any().optional(),
    leadingAvatarSize: z.any().optional(),
    trailingIcon: z.any().optional(),
  }).optional(),
})

// Social link schema for content data
export const socialSchema = z.object({
  name: z.string(),
  url: z.string(),
})

export const userSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  to: z.string().optional(),
  avatar: avatarSchema,
  socials: z.array(socialSchema).optional(),
  email: z.string().email().optional(),
})

export const authorSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  to: z.string().optional(),
  avatar: avatarSchema,
})

// Content layout properties schema
export const layoutSchema = z.object({
  metadataComponent: z.enum(['none', 'header', 'hero']).default('header'),
  container: z.boolean().optional(),
  toc: z.boolean().optional(),
  prose: z.boolean().optional(),
})

export const contentUISchema = z.object({
  main: z.any().optional(),
  container: z.any().optional(),
  page: z.any().optional(),
  body: z.any().optional(),
  toc: z.any().optional(),
  footer: z.any().optional(),
})

export const contentSchema = z.object({
  layout: layoutSchema,
  hero: pageHeroSchema.optional(),
  header: pageHeaderSchema.optional(),
  ui: contentUISchema,
})

export const articleSchema = contentSchema.extend({
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  image: z.string().editor({ input: 'media' }),
  authors: z.array(z.string()).optional(),
  date,
  dateEnd: date,
  category: z.string().optional(),
  tags: z.array(z.string()),
  resolvedBadge: badgeSchema,
  resolvedAuthors: z.array(authorSchema).optional(),
})

export const teamSchema = createBaseSchema().extend({
  icon,
  location: z.string().optional(),
  links,
})

export const tournamentSchema = createBaseSchema().extend({
  icon,
  location: z.string().optional(),
  links,
  date,
  dateEnd: date,
  resolvedBadge: badgeSchema.optional(),
})
