import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { authorSchema, contentUISchema, layoutSchema, pageHeaderSchema, pageHeroSchema } from './types'

export default defineContentConfig({
  collections: {
    snippet: defineCollection({
      type: 'page',
      source: 'snippets/**/*.{md,yaml}',
    }),
    content: defineCollection({
      type: 'page',
      source: '**/*.{md,yaml}',
      schema: z.object({
        layout: layoutSchema,
        hero: pageHeroSchema.optional(),
        header: pageHeaderSchema.optional(),
        ui: contentUISchema,
      }),
    }),
    author: defineCollection({
      type: 'data',
      source: 'authors/**/*.{md,yaml}',
      schema: authorSchema,
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*',
      schema: z.object({
        image: z.string().editor({ input: 'media' }),
        authors: z.array(authorSchema),
        date: z.string().date(),
        draft: z.boolean().optional(),
        category: z.enum(['Release', 'Tutorial', 'Announcement', 'Article']),
        tags: z.array(z.string()),
      }),
    }),
  },
})
