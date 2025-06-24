<script setup lang="ts">
const appConfig = useAppConfig()

const radius = computed(() => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`)
const blackAsPrimary = computed(() => appConfig.theme.blackAsPrimary ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')

useHead({
  title: 'Schachfreunde Heilbronn-Biberach 1978 e. V.',
  titleTemplate: '%s | Schachfreunde Heilbronn-Biberach 1978 e. V.',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#171717' },
  ],
  style: [
    { innerHTML: radius, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: blackAsPrimary, id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
  ],
  htmlAttrs: {
    lang: 'de',
    dir: 'ltr',
    class: 'scroll-smooth',
  },
})

useSeoMeta({
  author: 'Schachfreunde Heilbronn-Biberach 1978 e. V.',
  description: 'Schachfreunde Heilbronn-Biberach 1978 e. V. - Der Schachverein im Heilbronner Stadtteil Biberach',
  robots: 'index, follow',
})

const { searchTerm, groups } = useNavigation()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('article'))
const { data: teamFiles } = useLazyAsyncData('search:team', () => queryCollectionSearchSections('team'), { server: false })
const { data: tournamentFiles } = useLazyAsyncData('search:tournament', () => queryCollectionSearchSections('tournament'), { server: false })
const { data: blogFiles } = useLazyAsyncData('search:blog', () => queryCollectionSearchSections('blog').where('status', '=', 'published'), { server: false, transform: data => data.toReversed() })

const files = computed(() => [
  ...(teamFiles.value || []),
  ...(tournamentFiles.value || []),
  ...(blogFiles.value || []),
])
</script>

<template>
  <UApp>
    <NuxtPage />

    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
        :files="files"
        :navigation="navigation"
        :groups="groups"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
    <NuxtPwaAssets />
  </UApp>
</template>

<style>
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
}

/* ::view-transition-old(root) {
  animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
}

::view-transition-new(root) {
  animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in;
} */
</style>
