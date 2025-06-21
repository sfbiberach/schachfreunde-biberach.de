import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { blogSchema, cardSchema, contentSchema, pageSectionSchema, teamSchema, userSchema } from './types'

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
    content: defineCollection({
      type: 'page',
      source: '**/*.{md,yaml}',
      schema: contentSchema,
    }),
    user: defineCollection({
      type: 'data',
      source: 'users/**/*.{md,yaml}',
      schema: userSchema,
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.{md,yaml}',
      schema: blogSchema,
    }),
    team: defineCollection({
      type: 'page',
      source: 'mannschaften/**/*.{md,yaml}',
      schema: teamSchema,
    }),
  },
})
