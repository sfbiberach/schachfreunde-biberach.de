import { defineBlogCollections } from '@happydesigns/blog/content'
import { articleCollectionIndexes, collectionSchemas, contentImageSchema, createPageSectionSchema, userCollectionIndexes } from '@happydesigns/ui/schemas'
import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { defineRobotsSchema } from '@nuxtjs/robots/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { z } from 'zod'
import blog from './blog.config'

const seo = {
  sitemap: defineSitemapSchema(),
  robots: defineRobotsSchema(),
}

const userAvatarSchema = z.object({
  src: property(z.string()).editor({ input: 'media' }).optional(),
  alt: z.string().optional(),
  icon: property(z.string()).editor({ input: 'icon' }).optional(),
  text: z.string().optional(),
}).optional()

const userContactSchema = z.object({
  group: z.enum(['board', 'sport-youth', 'organization']),
  order: z.number().int().nonnegative(),
  role: z.string().min(1),
  email: z.email(),
  responsibilities: z.array(z.string().min(1)).min(1),
}).optional()

const userVariantSchema = collectionSchemas.user.extend({
  avatar: userAvatarSchema,
  contact: userContactSchema,
})

const leagueSchema = z.object({
  provider: z.literal('nuliga'),
  season: z.string().min(1),
  groupUrl: z.url(),
  teamName: z.string().min(1),
}).optional()

const articleImageSchema = contentImageSchema.extend({
  alt: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  position: z.string().optional(),
}).optional()

export default defineContentConfig({
  collections: {
    user: defineCollection({
      type: 'data',
      source: 'users/**/*.{md,yaml}',
      schema: userVariantSchema,
      indexes: userCollectionIndexes,
    }),

    landing: defineCollection({
      type: 'page',
      source: 'index.yaml',
      schema: z.object({
        hero: createPageSectionSchema({}),
        highlights: z.array(z.object({
          title: z.string(),
          description: z.string(),
          to: z.string(),
          icon: property(z.string()).editor({ input: 'icon' }),
          visibleFrom: z.string().optional(),
          visibleUntil: z.string().optional(),
        })).optional(),
        training: z.object({
          weekday: z.number().int().min(0).max(6),
          youthTime: z.string(),
          adultTime: z.string(),
          exceptions: z.array(z.object({
            from: z.string(),
            until: z.string().optional(),
            label: z.string().optional(),
          })).optional(),
        }),
        gallery: z.object({
          title: z.string(),
          description: z.string(),
        }).optional(),
      }).extend(seo),
    }),

    snippet: defineCollection({
      type: 'page',
      source: {
        include: 'snippets/**/*.{md,yaml}',
        prefix: '/snippets',
      },
    }),

    content: defineCollection({
      type: 'page',
      source: {
        include: 'legal/**/*.{md,yaml}',
        prefix: '/',
      },
      schema: collectionSchemas.content.extend(seo),
    }),

    page: defineCollection({
      type: 'page',
      source: {
        include: 'pages/**/*.{md,yaml}',
        prefix: '/',
      },
      schema: collectionSchemas.content.extend(seo),
    }),

    ...defineBlogCollections(blog, {
      blog: {
        source: 'blog/article/**/*.{md,yaml}',
        baseSchema: collectionSchemas.article,
        schema: {
          ...seo,
          tournament: z.string().optional(),
          image: articleImageSchema,
        },
      },
    }),

    team: defineCollection({
      type: 'page',
      source: 'mannschaften/**/*.{md,yaml}',
      schema: collectionSchemas.event.extend({
        ...seo,
        league: leagueSchema,
      }),
      indexes: articleCollectionIndexes,
    }),

    tournament: defineCollection({
      type: 'page',
      source: 'turniere/**/*.{md,yaml}',
      schema: collectionSchemas.event.extend(seo),
      indexes: articleCollectionIndexes,
    }),
  },
})
