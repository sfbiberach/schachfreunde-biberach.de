<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70',
})

const { data: pageData } = await usePageContent({
  collection: 'page',
  path: '/blog',
})

const route = useRoute()
const appConfig = useAppConfig()

const category = ref<{ label: string, color: string } | undefined>()
const page = ref<number>(1)

watchEffect(() => {
  const categories = Object.values(appConfig.app.blog.categories)
  const categoryQuery = route.query.category as string
  category.value = categories.find(c => c.label.toLocaleLowerCase() === categoryQuery?.toLocaleLowerCase())

  const pageQuery = route.query.page as string
  page.value = Number.parseInt(pageQuery ?? '1')

  if (import.meta.client) {
    usePrimaryColor(category.value?.color)
  }
})

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
        <HArticleList />
      </UPageBody>
    </UContainer>
  </NuxtLayout>
</template>
