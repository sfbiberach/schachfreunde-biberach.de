<script setup lang="ts">
import { defu } from 'defu'
import type { Badge } from '#ui/types'
import type { BlogArticle } from '~/types'

const appConfig = useAppConfig()
const { data: content } = await useAsyncData('/blog', () => queryContent('/blog').findOne())

const route = useRoute()

const page = ref(1)
const active = useState()

const { data: articles } = useFetch<BlogArticle[]>('/api/blog.json', {
  default: () => [],
})

const pageArticles = computed(() => {
  const start = (page.value - 1) * 12
  const end = start + 12
  return articles.value?.slice(start, end)
})

watchEffect(() => {
  updatePageFromQuery()
})

watch(page, () => {
  navigateTo({ path: page.value > 1 ? `/blog/${page.value}` : '/blog', query: { page: page.value > 1 ? page.value : undefined } })
})

function updatePageFromQuery() {
  page.value = Math.max(Number.parseInt(String(route.query.page)), 1)
}

function getBadgeProps(badge: keyof typeof appConfig.app.blog.categories | Badge) {
  return defu(badge, appConfig.app.blog.categories[badge as keyof typeof appConfig.app.blog.categories] as Badge)
}

useHead({
  link: [
    {
      rel: 'alternate',
      type: 'application/atom+xml',
      title: 'Blog RSS',
      href: '/blog/rss.xml',
    },
  ],
})

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
  <NuxtLayout v-bind="content">
    <template #description>
      <UButton to="/blog/rss.xml" color="gray" external icon="i-ph-rss" size="2xs" target="_blank" class="mt-4">
        RSS
      </UButton>
    </template>
    <div v-if="articles" class="flex flex-col gap-8">
      <UPagination v-model="page" :page-count="12" :total="articles.length" class="w-full" />
      <UBlogList>
        <UBlogPost
          v-for="(article, index) in pageArticles"
          :key="index"
          :to="article._path"
          :title="article.title"
          :description="article.description"
          :date="new Date(article.date).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' })"
          :authors="article.authors"
          :badge="getBadgeProps(article.category)"
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
  </NuxtLayout>
</template>
