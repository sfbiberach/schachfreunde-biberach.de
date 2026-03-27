<script setup lang="ts">
import type { BadgeProps, BreadcrumbItem } from '#ui/types'

interface CategoriesMap {
  [category: string]: BadgeProps
}

const { data: page } = await usePageContent({
  collection: 'article',
})

const { data: tournament } = await useAsyncData(
  `tournament:${page.value?.tournament}`,
  async () => {
    if (!page.value?.tournament) {
      return null
    }
    return queryCollection('tournament')
      .where('path', 'LIKE', `%${page.value.tournament}`)
      .first()
  },
  { watch: [() => page.value?.tournament] },
)

const tournamentLink = computed(() => tournament.value?.path)
const tournamentTitle = computed(() => tournament.value?.title)

const appConfig = useAppConfig()

watchEffect(() => {
  const categories = appConfig.app.blog.categories as CategoriesMap
  const category = page.value?.category
  const color = category ? categories[category]?.color : undefined

  if (import.meta.client) {
    usePrimaryColor(color)
  }
})
</script>

<template>
  <NuxtLayout name="article">
    <ContentRenderer v-if="page" :value="page" />

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
  </NuxtLayout>
</template>
