<script setup lang="ts">
import type { BadgeProps } from '#ui/types'
import { BLOG_PATHS } from '~~/constants/blog'

const props = defineProps<{
  category?: { label: string, color: string }
  page: number
}>()

const labelAll = 'Alle'
const itemsPerPage = 12

const appConfig = useAppConfig()
const { data: content } = await usePageContent({ path: '/blog' })

const page = ref(1)

const categories = [
  { label: labelAll },
  ...Object.values(appConfig.app.blog.categories),
].map((category, index) => ({
  ...category,
  to: index === 0 ? BLOG_PATHS.BASE : `${BLOG_PATHS.BASE}/${category.label.toLocaleLowerCase()}`,
}))

const color = computed(() => props.category?.color)

const { data: articles } = await useBlogList({ categoriesMap: appConfig.app.blog.categories as Record<string, BadgeProps> })

const categoryArticles = computed(() =>
  Array.isArray(articles.value)
    ? articles.value.filter(article => props.category ? props.category.label === article.category : true)
    : [],
)

const pageArticles = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return categoryArticles.value?.slice(start, end)
})

watchEffect(() => {
  updatePageFromQuery()
})

watch(color, () => {
  usePrimaryColor(props.category?.color)
})

onMounted(() => {
  usePrimaryColor(props.category?.color)
})

watch(page, () => {
  const path = [BLOG_PATHS.BASE]
  if (props.category) {
    path.push(props.category.label)
  }
  if (page.value > 1) {
    path.push(page.value.toString())
  }

  navigateTo({ path: path.join('/') })
})

function updatePageFromQuery() {
  page.value = Math.max(props.page, 1)
}

useHead({
  link: [
    {
      rel: 'alternate',
      type: 'application/atom+xml',
      title: 'Blog RSS',
      href: `${BLOG_PATHS.BASE}/rss.xml`,
    },
  ],
})
</script>

<template>
  <NuxtLayout name="content" path="/blog">
    <template #description>
      <p class="mb-8">
        {{ content?.description }}
      </p>
      <UButton :to="`${BLOG_PATHS.BASE}/rss.xml`" color="neutral" variant="subtle" external icon="i-lucide-rss" size="xs" target="_blank">
        RSS
      </UButton>
    </template>
    <div class="flex flex-col gap-8">
      <div class="flex justify-between flex-wrap gap-4">
        <UNavigationMenu :items="categories" :highlight="true" />
      </div>
      <UBlogPosts v-if="articles">
        <UBlogPost
          v-for="(article, index) in pageArticles"
          :key="index"
          :to="article.path"
          :title="article.title"
          :description="article.description"
          :date="formatDate(article.date)"
          :badge="article.resolvedBadge"
          :authors="(article.resolvedAuthors || []).map(author => ({ ...author, target: '_blank' }))"
          variant="subtle"
          :ui="{
            title: 'post-title line-clamp-2 whitespace-normal',
            description: 'post-description line-clamp-3',
          }"
        >
          <template #date>
            <time v-if="article.date" :datetime="new Date(article.date).toISOString()" class="text-sm text-gray-500 dark:text-gray-400 font-medium pointer-events-none">
              {{ new Date(article.date).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' }) }}
            </time>
          </template>
        </UBlogPost>
      </UBlogPosts>
      <div class="w-full flex justify-center mt-4">
        <UPagination v-model:page="page" :items-per-page="itemsPerPage" :total="categoryArticles?.length" />
      </div>
    </div>
  </NuxtLayout>
</template>
