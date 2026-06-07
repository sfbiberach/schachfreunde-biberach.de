<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70',
})

const { data: pageData } = await usePageContent({
  collection: 'page',
  path: '/blog',
})

const route = useRoute()
const { config } = useVariant('article')

const categoryColor = computed(() => {
  const categoryQuery = Array.isArray(route.query.category)
    ? route.query.category[0]
    : route.query.category

  return typeof categoryQuery === 'string'
    ? config.value.categories?.[categoryQuery]?.color
    : undefined
})

if (import.meta.client) {
  watch(categoryColor, color => usePrimaryColor(color), { immediate: true })
}

usePageSeo(pageData)
const header = computed(() => resolvePageHeader(pageData.value))
</script>

<template>
  <NuxtLayout>
    <UPageHero
      v-if="header"
      v-bind="(header as any)"
    >
      <template #description>
        {{ header.description }}

        <div class="mt-4">
          <UButton
            to="/blog/rss.xml"
            color="neutral"
            external
            icon="i-lucide-rss"
            variant="subtle"
            size="xs"
            target="_blank"
          >
            RSS
          </UButton>
        </div>
      </template>
    </UPageHero>

    <UContainer v-if="pageData">
      <UPageBody>
        <HArticleList :sort="{ field: 'date', direction: 'DESC' }" status="published" />
      </UPageBody>
    </UContainer>
  </NuxtLayout>
</template>
