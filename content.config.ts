import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { z } from 'zod/v4'
import { cardSchema, teamSchema, tournamentSchema } from './types'

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])
const orientationEnum = z.enum(['vertical', 'horizontal'])
const targetEnum = z.enum(['_blank', '_parent', '_self', '_top'])

// -----------------------------------------------------------------------------
// Sub-Schemas
// -----------------------------------------------------------------------------
const imageSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  class: z.string().optional(),
})

const linkSchema = z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional(),
  size: sizeEnum.optional(),
  trailing: z.boolean().optional(),
  target: z.union([targetEnum, z.string()]).optional(),
  color: colorEnum.optional(),
  variant: variantEnum.optional(),
})

const baseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ui: z.record(z.string(), z.any()).optional(),
})

const featureItemSchema = baseSchema.extend({
  icon: z.string().optional(),
})

export const socialSchema = z.object({
  name: z.string(),
  url: z.string(),
})

// -----------------------------------------------------------------------------
// Section Schemas
// -----------------------------------------------------------------------------
const pageSectionSchema = baseSchema.extend({
  as: z.string().optional(),
  headline: z.string().optional(),
  icon: z.string().optional(),
  orientation: orientationEnum.optional(),
  reverse: z.boolean().optional(),
  image: imageSchema.optional(),
  links: z.array(linkSchema).optional(),
  features: z.array(featureItemSchema).optional(),
})

const pageHeroSchema = pageSectionSchema.pick({
  title: true,
  description: true,
  headline: true,
  links: true,
  orientation: true,
  reverse: true,
  ui: true,
  image: true,
}).extend({})

const pageHeaderSchema = baseSchema.extend({
  headline: z.string().optional(),
  links: z.array(linkSchema).optional(),
})

const layoutSchema = z.object({
  metadataComponent: z.enum(['none', 'header', 'hero']).default('header'),
  container: z.boolean().optional(),
  toc: z.boolean().optional(),
  prose: z.boolean().optional(),
})

// -----------------------------------------------------------------------------
// Content Types
// -----------------------------------------------------------------------------
const authorSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  to: z.string().optional(),
  avatar: property(z.object({})).inherit('@nuxt/ui/components/Avatar.vue').optional(),
})

const userSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  to: z.string().optional(),
  avatar: property(z.object({})).inherit('@nuxt/ui/components/Avatar.vue').optional(),
  socials: z.array(socialSchema).optional(),
  email: z.string().email().optional(),
})

const pageSchema = z.object({
  layout: layoutSchema.optional(),
  hero: pageHeroSchema.optional(),
  header: pageHeaderSchema.optional(),
  ui: z.record(z.string(), z.any()).optional(),
})

export const articleSchema = pageSchema.extend({
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  image: property(z.string()).editor({ input: 'media' }),
  authors: z.array(z.string()).optional(),
  date: z.string().date().optional(),
  dateEnd: z.string().date().optional(),
  category: z.string().optional(),
  tournament: z.string().optional(),
  tags: z.array(z.string()),
  resolvedBadge: property(z.object({})).inherit('@nuxt/ui/components/Badge.vue').optional(),
  resolvedAuthors: z.array(authorSchema).optional(),
})

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.yaml',
      schema: z.object({
        hero: pageSectionSchema,
        cards: property(z.object({})).inherit('@nuxt/ui/components/PageCard.vue').optional(),
      }),
    }),
    snippet: defineCollection({
      type: 'page',
      source: 'snippets/**/*.{md,yaml}',
    }),
    page: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: {
          include: 'pages/**/*.{md,yaml}',
          prefix: '/',
        },
        schema: pageSchema,
      }),
    ),
    user: defineCollection({
      type: 'data',
      source: 'users/**/*.{md,yaml}',
      schema: userSchema,
    }),
    article: defineCollection({
      type: 'page',
      source: 'blog/article/**/*.{md,yaml}',
      schema: articleSchema,
    }),
    team: defineCollection({
      type: 'page',
      source: 'mannschaften/**/*.{md,yaml}',
      schema: teamSchema,
    }),
    tournament: defineCollection({
      type: 'page',
      source: 'turniere/**/*.{md,yaml}',
      schema: tournamentSchema,
    }),
  },
})
