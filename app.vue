<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/types'

useHead({
  title: 'Schachfreunde Heilbronn-Biberach 1978 e. V.',
  titleTemplate: '%s | Schachfreunde Heilbronn-Biberach 1978 e. V.',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'msapplication-TileColor', content: '#fff' },
    { name: 'theme-color', content: '#fff' },
  ],
  link: [
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-tourch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#d8201f' },
  ],
  htmlAttrs: {
    lang: 'de',
    dir: 'ltr',
    class: 'scroll-smooth',
  },
})

useSeoMeta({
  author: 'Schachfreunde Heilbronn-Biberach 1978 e.V.',
  description: 'Schachfreunde Heilbronn-Biberach 1978 e.V. - Der Schachverein im Heilbronner Stadtteil Biberach',
  robots: 'index, follow',
})

const config = useAppConfig()
const links = config.links?.footer?.flatMap(({ label, children }) => ({
  label,
  children: children.map(({ label, to, icon }: { label: string, to: string, icon: string }) => ({
    label,
    to,
    icon,
  })),
}))

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation(queryContent('blog')), {
  default: () => [],
})

const { data: files } = useLazyFetch<ParsedContent[]>('/api/blog.json', { default: () => [], server: false })

provide('navigation', navigation)
provide('files', files)

if (import.meta.client)
  usePrimaryColor()
</script>

<template>
  <div class="overflow-hidden">
    <AppHeader />
    <NuxtPage />
    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch :files="files" :links="links" :navigation="navigation" />
    </ClientOnly>
  </div>
</template>

<style>
h1, h2, h3, h4, h5, h6 {
  @apply font-serif;
}

/* ::view-transition-old(root) {
  animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
}

::view-transition-new(root) {
  animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in;
} */
</style>
