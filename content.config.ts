import {
  articleCollection,
  authorsTrait,
  backButtonTrait,
  categoryTrait,
  copyButtonTrait,
  datesTrait,
  eventCollection,
  headerTrait,
  layoutTrait,
  linksTrait,
  locationTrait,
  pageCollection,
  separatorButtonsTrait,
  separatorTrait,
  snippetCollection,
  statusTrait,
  surroundTrait,
  tocTrait,
  userCollection,
  userTrait,
} from '@h4designs/ui/schemas'
import { property } from '@nuxt/content'
import { defineCollection, defineContentConfig, defineTrait } from 'nuxt-content-traits/utils'
import { z } from 'zod'

export default defineContentConfig({
  traits: {
    dates: defineTrait(datesTrait),
    authors: defineTrait(authorsTrait),
    category: defineTrait(categoryTrait),
    status: defineTrait(statusTrait),
    header: defineTrait(headerTrait),
    toc: defineTrait(tocTrait),
    links: defineTrait(linksTrait),
    location: defineTrait(locationTrait),
    separator: defineTrait(separatorTrait),
    surround: defineTrait(surroundTrait),
    copyButton: defineTrait(copyButtonTrait),
    separatorButtons: defineTrait(separatorButtonsTrait),
    backButton: defineTrait(backButtonTrait),
    layout: defineTrait(layoutTrait),
    user: defineTrait(userTrait),
    tournament: defineTrait({
      schema: z.object({
        tournament: z.string().optional(),
      }),
    }),
  },
  collections: {
    user: defineCollection(userCollection),

    landing: defineCollection({
      type: 'page',
      source: 'index.yaml',
      schema: z.object({
        hero: property(z.object({})).inherit('@nuxt/ui/components/PageSection.vue'),
        cards: z.array(property(z.object({})).inherit('@nuxt/ui/components/PageCard.vue')).optional(),
      }),
    }),

    snippet: defineCollection(snippetCollection),

    page: defineCollection(pageCollection),

    article: defineCollection({
      ...articleCollection,
      source: 'blog/article/**/*.{md,yaml}',
      traits: [...articleCollection.traits, 'tournament'],
    }),

    team: defineCollection({
      ...eventCollection,
      source: 'mannschaften/**/*.{md,yaml}',
    }),

    tournament: defineCollection({
      ...eventCollection,
      source: 'turniere/**/*.{md,yaml}',
    }),
  },
})
