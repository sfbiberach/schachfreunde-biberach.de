import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { articleSchema, cardSchema, contentSchema, pageSectionSchema, teamSchema, tournamentSchema, userSchema } from './types'

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: '**/*.{md,yaml}',
      schema: z.object({
        hero: pageSectionSchema,
        cards: cardSchema.optional(),
      }),
    }),
    snippet: defineCollection({
      type: 'page',
      source: 'snippets/**/*.{md,yaml}',
    }),
    content: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: {
          include: '**/*.{md,yaml}',
          exclude: ['snippets/**', 'users/**'],
        },
        schema: contentSchema,
      }),
    ),
    user: defineCollection({
      type: 'data',
      source: 'users/**/*.{md,yaml}',
      schema: userSchema,
    }),
    article: defineCollection({
      type: 'page',
      source: '**/*.{md,yaml}',
      schema: articleSchema,
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.{md,yaml}',
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
