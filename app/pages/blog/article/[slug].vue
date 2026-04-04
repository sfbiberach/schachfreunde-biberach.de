<script setup lang="ts">
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

const { traitConfig } = useCollectionTraits('article')

if (import.meta.client) {
  watch(
    [() => page.value?.category, traitConfig],
    ([category, config]) => {
      const color = category ? config?.categories?.[category]?.color : undefined
      usePrimaryColor(color)
    },
    { immediate: true },
  )
}
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
