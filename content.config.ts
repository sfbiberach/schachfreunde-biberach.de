import { mergeVariantSchemas } from '@happydesigns/nuxt-variants/schemas'
import { variantSchemas } from '@happydesigns/ui/schemas'
import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { defineRobotsSchema } from '@nuxtjs/robots/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { z } from 'zod'

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

const userVariantSchema = variantSchemas.user.extend({
  avatar: userAvatarSchema,
})

const siteVariantSchemas = {
  ...variantSchemas,
  user: z.object({}),
  articleTournament: z.object({
    tournament: z.string().optional(),
  }),
}

const leagueSchema = z.object({
  provider: z.literal('nuliga'),
  season: z.string().min(1),
  groupUrl: z.url(),
  teamName: z.string().min(1),
}).optional()

const articleImageSchema = z.object({
  src: property(z.string()).editor({ input: 'media' }),
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
    }),

    landing: defineCollection({
      type: 'page',
      source: 'index.yaml',
      schema: z.object({
        hero: property(z.object({})).inherit('@nuxt/ui/components/PageSection.vue'),
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

    page: defineCollection({
      type: 'page',
      source: {
        include: 'pages/**/*.{md,yaml}',
        prefix: '/',
      },
      schema: mergeVariantSchemas(['page'], siteVariantSchemas).extend(seo),
    }),

    article: defineCollection({
      type: 'page',
      source: 'blog/article/**/*.{md,yaml}',
      schema: mergeVariantSchemas(['article'], siteVariantSchemas).extend({
        ...seo,
        image: articleImageSchema,
      }),
    }),

    team: defineCollection({
      type: 'page',
      source: 'mannschaften/**/*.{md,yaml}',
      schema: mergeVariantSchemas(['team'], siteVariantSchemas).extend({
        ...seo,
        league: leagueSchema,
      }),
    }),

    tournament: defineCollection({
      type: 'page',
      source: 'turniere/**/*.{md,yaml}',
      schema: mergeVariantSchemas(['tournament'], siteVariantSchemas).extend(seo),
    }),
  },
})
