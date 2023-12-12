import { field, group } from '@nuxthq/studio/theme'

export default defineNuxtSchema({
  appConfig: {
    links: group({
      title: 'Links',
      description: 'Links configuration',
      icon: 'i-mdi-link',
      fields: {
        header: field({
          type: 'array',
          title: 'Header links',
          description: 'Links in the header',
          icon: 'i-mdi-arrow-up',
          items: [
            {
              type: 'Link',
            },
          ],
        }),
      },
    }),
  },
})
