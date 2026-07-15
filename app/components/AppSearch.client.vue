<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { CommandPaletteGroup, ContentSearchFile } from '@nuxt/ui'

const appConfig = useAppConfig()
const { open } = useContentSearch()

const searchTerm = ref('')
const navigation = shallowRef<ContentNavigationItem[]>([])
const files = shallowRef<ContentSearchFile[]>([])
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const error = shallowRef<Error>()

let pendingRequest: Promise<void> | undefined

const groups = computed<CommandPaletteGroup[]>(() => {
  if (!error.value) {
    return appConfig.app.search.groups
  }

  return [
    {
      id: 'search-error',
      label: 'Suche nicht verfügbar',
      ignoreFilter: true,
      items: [
        {
          label: 'Erneut versuchen',
          description: 'Der Suchindex konnte nicht geladen werden.',
          icon: 'i-lucide-refresh-cw',
          onSelect: () => void loadSearchData(),
        },
      ],
    },
    ...appConfig.app.search.groups,
  ]
})

function toError(cause: unknown) {
  return cause instanceof Error ? cause : new Error(String(cause))
}

async function loadSearchData() {
  if (status.value === 'success') {
    return
  }

  if (pendingRequest) {
    return pendingRequest
  }

  status.value = 'pending'
  error.value = undefined

  pendingRequest = Promise.all([
    $fetch<ContentNavigationItem[]>('/api/navigation.json'),
    $fetch<ContentSearchFile[]>('/api/search.json'),
  ])
    .then(([loadedNavigation, loadedFiles]) => {
      navigation.value = loadedNavigation
      files.value = loadedFiles
      status.value = 'success'
    })
    .catch((cause: unknown) => {
      error.value = toError(cause)
      status.value = 'error'
      console.error('Failed to load the search index.', error.value)
    })
    .finally(() => {
      pendingRequest = undefined
    })

  return pendingRequest
}

watch(open, (isOpen) => {
  if (isOpen) {
    void loadSearchData()
  }
}, { immediate: true })
</script>

<template>
  <UContentSearch
    v-model:search-term="searchTerm"
    :title="appConfig.app.search.title"
    :description="appConfig.app.search.description"
    :placeholder="appConfig.app.search.placeholder"
    :links="appConfig.app.search.links"
    :groups="groups"
    :files="files"
    :navigation="navigation"
    :loading="status === 'pending'"
    :fuse="{ resultLimit: appConfig.app.search.resultLimit }"
  />
</template>
