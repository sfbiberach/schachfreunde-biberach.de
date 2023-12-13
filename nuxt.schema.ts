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
          icon: 'i-mdi-page-layout-header',
          items: [
            {
              type: 'Link',
            },
          ],
        }),
        footer: field({
          type: 'array',
          title: 'Footer links',
          description: 'Links in the footer',
          icon: 'i-mdi-page-layout-footer',
          items: [
            {
              type: 'Link',
            },
          ],
        }),
      },
    }),
    newsletter: group({
      title: 'Newsletter',
      description: 'Newsletter configuration',
      icon: 'i-mdi-email',
      fields: {
        visible: field({
          type: 'boolean',
          title: 'Visible',
          description: 'Newsletter visible',
          icon: 'i-mdi-eye',
        }),
        label: field({
          type: 'string',
          title: 'Label',
          description: 'Newsletter label',
          icon: 'i-mdi-text-short',
        }),
        description: field({
          type: 'string',
          title: 'Description',
          description: 'Newsletter description',
          icon: 'i-mdi-text',
        }),
        placeholder: field({
          type: 'string',
          title: 'Placeholder',
          description: 'Newsletter placeholder',
          icon: 'i-mdi-comment-text',
        }),
        buttonText: field({
          type: 'string',
          title: 'Button text',
          description: 'Newsletter button text',
          icon: 'i-mdi-cursor-default-click',
        }),
      },
    }),

  },
})
