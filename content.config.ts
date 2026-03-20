import { articleSchema, eventSchema, pageSchema, userSchema } from '@h4designs/ui/schemas'
import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { asRobotsCollection } from '@nuxtjs/robots/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { z } from 'zod/v4'

export default defineContentConfig({
  collections: {
    user: defineCollection({
      type: 'data',
      source: 'users/**/*.{md,yaml}',
      schema: userSchema,
    }),

    landing: defineCollection({
      type: 'page',
      source: 'index.yaml',
      schema: z.object({
        hero: property(z.object({})).inherit('@nuxt/ui/components/PageSection.vue'),
        cards: z.array(property(z.object({})).inherit('@nuxt/ui/components/PageCard.vue')).optional(),
      }),
    }),

    snippet: defineCollection({
      type: 'page',
      source: 'snippets/**/*.{md,yaml}',
    }),

    page: defineCollection(
      asRobotsCollection(
        asSitemapCollection({
          type: 'page',
          source: {
            include: 'pages/**/*.{md,yaml}',
            prefix: '/',
          },
          schema: pageSchema,
        }),
      ),
    ),

    article: defineCollection(
      asRobotsCollection(
        asSitemapCollection({
          type: 'page',
          source: 'blog/article/**/*.{md,yaml}',
          schema: articleSchema.extend({
            tournament: z.string().optional(),
          }),
        }),
      ),
    ),

    team: defineCollection(
      asRobotsCollection(
        asSitemapCollection({
          type: 'page',
          source: 'mannschaften/**/*.{md,yaml}',
          schema: eventSchema,
        }),
      ),
    ),

    tournament: defineCollection(
      asRobotsCollection(
        asSitemapCollection({
          type: 'page',
          source: 'turniere/**/*.{md,yaml}',
          schema: eventSchema,
        }),
      ),
    ),
  },
})
