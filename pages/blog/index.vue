<script setup lang="ts">
import { defu } from 'defu'
import type { Badge } from '#ui/types'
import type { BlogArticle } from '~/types'

const appConfig = useAppConfig()
const route = useRoute()

const page = ref(1)
const active = useState()

const { data: articles } = useFetch<BlogArticle[]>('/api/blog.json', {
  default: () => [],
})

const pageArticles = computed(() => {
  console.log('pageArticles', page.value, articles.value?.length)
  const start = (page.value - 1) * 12
  const end = start + 12
  return articles.value?.slice(start, end)
})

console.log(route, route.query.page)

watchEffect(() => {
  updatePageFromQuery()
})

watch(page, () => {
  navigateTo({ query: { ...route.query, page: page.value > 1 ? page.value : undefined } })
})

onMounted(() => {
  updatePageFromQuery()
})

function updatePageFromQuery() {
  console.log('updatePageFromQuery', route.query.page, route.params.slug)
  page.value = Math.max(Number.parseInt(route.query.page as string) || 1, 1)
}

function getBadgeProps(badge: keyof typeof appConfig.app.blog.badges | Badge) {
  return defu(badge, appConfig.app.blog.badges[badge as keyof typeof appConfig.app.blog.badges] as Badge)
}

// useSeoMeta({
//   title: page.value.title,
//   ogTitle: page.value.title,
//   description: page.value.description,
//   ogDescription: page.value.description,
// })

// defineOgImage({
//   component: 'Saas',
//   title: page.value.title,
//   description: page.value.description,
// })
</script>

<template>
  <NuxtLayout>
    <ClientOnly>
      <div v-if="articles" class="flex flex-col gap-8">
        <UPagination v-model="page" :page-count="12" :total="articles.length" class="w-full" />
        <UBlogList>
          <UBlogPost
            v-for="(article, index) in pageArticles"
            :key="index"
            :to="article._path"
            :title="article.title"
            :description="article.description"
            :date="new Date(article.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
            :authors="article.authors"
            :badge="getBadgeProps(article.badge)"
            :orientation="index === 0 ? 'horizontal' : 'vertical'"
            :class="[{ active: active === index }, index === -1 && 'col-span-full']"
            :ui="{
              title: 'post-title line-clamp-2 whitespace-normal',
              description: 'post-description line-clamp-2',
            }"
            @click="active = index"
          >
            <template #date>
              <time v-if="article.date" :datetime="new Date(article.date).toISOString()" class="text-sm text-gray-500 dark:text-gray-400 font-medium pointer-events-none">
                {{ new Date(article.date).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </time>
            </template>
          </UBlogPost>
        </UBlogList>
      </div>
    </ClientOnly>
  </NuxtLayout>
</template>
