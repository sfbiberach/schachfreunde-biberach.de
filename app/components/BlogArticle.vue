<script setup lang="ts">
import { BLOG_PATHS } from '~~/constants/blog'

const url = useRequestURL()
const { copy } = useClipboard()
const route = useRoute()

const { data: article } = await useBlogArticle({ slug: route.params.slug as string })

const { data: surround } = await useAsyncData(
  `${route.path}-surround`,
  () => queryCollectionItemSurroundings('blog', route.path, { fields: ['description'] })
    .where('status', '=', 'published')
    .order('date', 'DESC'),
)

const badge = resolveBadge(article.value?.category ?? '')
const tournamentSlug = computed(() => article.value?.tournament ?? '')

const { data: tournamentData } = await useAsyncData(
  () => `article-tournament:${tournamentSlug.value ?? ''}`,
  async () => {
    if (!tournamentSlug.value) {
      return null
    }
    return queryCollection('tournament')
      .path(`/turniere/${tournamentSlug.value}`)
      .first()
  },
  { watch: [tournamentSlug] },
)

const tournamentTitle = computed(() => tournamentData.value?.title ?? 'Turnierseite')

const tournamentLink = computed(() => {
  if (!tournamentSlug.value) {
    return undefined
  }
  return `/turniere/${tournamentSlug.value}`
})

const editLink = computed(() => {
  return `https://github.com/sfbiberach/schachfreunde-biberach.de/edit/main/content/${article.value?.stem}.md`
})

function copyLink() {
  copy(`${url.origin}${article.value?.path}`, { title: 'Link in Zwischenablage kopiert', icon: 'i-lucide-copy-check' })
}

onMounted(() => {
  usePrimaryColor(badge.color)
})
</script>

<template>
  <NuxtLayout name="article">
    <ContentRenderer v-if="article?.body" :value="article" />

    <template #header>
      <div v-if="tournamentLink" class="ml-auto flex">
        <UButton
          :to="tournamentLink"
          icon="i-ph-trophy"
          variant="solid"
          color="neutral"
        >
          {{ tournamentTitle }}
        </UButton>
      </div>
    </template>

    <div class="flex items-center justify-between mt-12 not-prose">
      <UButton icon="i-ph-arrow-left" color="primary" variant="ghost" :to="BLOG_PATHS.BASE">
        Zurück zum Blog
      </UButton>
      <div class="flex justify-end items-center gap-1.5">
        <UButton icon="i-ph-link-simple-duotone" variant="ghost" color="neutral" @click="copyLink">
          URL kopieren
        </UButton>
      </div>
    </div>

    <USeparator>
      <div
        v-if="editLink"
        class="flex items-center gap-2 text-sm text-muted"
      >
        <UButton
          variant="link"
          color="neutral"
          :to="editLink"
          target="_blank"
          icon="i-lucide-pen"
          :ui="{ leadingIcon: 'size-4' }"
        >
          Artikel bearbeiten
        </UButton>
        oder
        <UButton
          variant="link"
          color="neutral"
          to="https://github.com/sfbiberach/schachfreunde-biberach.de/issues/new/choose"
          target="_blank"
          icon="i-ph-warning-circle"
          :ui="{ leadingIcon: 'size-4' }"
        >
          Fehler melden
        </UButton>
      </div>
    </USeparator>

    <UContentSurround :surround />
  </NuxtLayout>
</template>

<style scoped>
.top-\[--header-height\] {
  top: var(--header-height);
}

.max-h-\[calc\(100vh-var\(--header-height\)\)\] {
  max-height: calc(100vh - var(--header-height));
}
</style>
