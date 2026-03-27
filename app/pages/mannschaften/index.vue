<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70',
})

const { data: page } = await usePageContent({
  collection: 'page',
  path: '/mannschaften',
})

usePageSeo(page)
const header = computed(() => resolvePageHeader(page.value))
</script>

<template>
  <NuxtLayout>
    <UPageHero
      v-if="header"
      v-bind="(header as any)"
    />

    <UContainer v-if="page">
      <UPageBody>
        <HArticleGrid collection="team">
          <template #date="{ article }">
            <HEventGridDate :article="article" />
          </template>
        </HArticleGrid>
      </UPageBody>
    </UContainer>
  </NuxtLayout>
</template>
