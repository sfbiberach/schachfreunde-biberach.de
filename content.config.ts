import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { cardSchema, contentSchema, contentUISchema, layoutSchema, pageHeaderSchema, pageHeroSchema, pageSectionSchema, userSchema } from './types'

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
      source: 'blog/*',
      schema: z.object({
        image: z.string().editor({ input: 'media' }),
        authors: z.array(z.string()).optional(),
        date: z.string().date(),
        draft: z.boolean().optional(),
        category: z.enum(['Release', 'Tutorial', 'Announcement', 'Article']),
        tags: z.array(z.string()),
      }),
    }),
  },
})
