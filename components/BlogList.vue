<script setup lang="ts">
import type { Badge } from '#ui/types'
import { defu } from 'defu'
import type { BlogArticle } from '~/types'

const props = defineProps<{
  category?: { label: string, color: string }
  page: number
}>()

const labelAll = 'Alle'
const pageCount = 12

const appConfig = useAppConfig()
const { data: content } = await useAsyncData('/blog', () => queryContent('/blog').findOne())

const page = ref(1)
const active = useState()

const categories = [
  { label: labelAll, color: 'gray' },
  ...Object.values(appConfig.app.blog.categories),
].map((category, index) => ({
  ...category,
  to: index === 0 ? '/blog' : `/blog/${category.label.toLocaleLowerCase()}`,
}))

const categoriesWithActive = computed(() =>
  categories.map(category => ({
    ...category,
    active: category.label.toLocaleLowerCase() === (props.category?.label ? props.category.label : labelAll).toLocaleLowerCase(),
  })),
)

const color = computed(() => props.category?.color)

const { data: articles } = await useFetch<BlogArticle[]>('/api/blog.json', {
  default: () => [],
})

const categoryArticles = computed(() => articles.value?.filter(article => props.category ? props.category.label === article.category : true))

const pageArticles = computed(() => {
  const start = (page.value - 1) * pageCount
  const end = start + pageCount
  return categoryArticles.value?.slice(start, end)
})

watchEffect(() => {
  updatePageFromQuery()
})

watch(color, () => {
  setPrimaryColor()
})

onMounted(() => {
  setPrimaryColor()
})

watch(page, () => {
  const path = ['/blog']
  if (props.category)
    path.push(props.category.label)
  if (page.value > 1)
    path.push(page.value.toString())

  navigateTo({ path: path.join('/') })
})

function updatePageFromQuery() {
  page.value = Math.max(props.page, 1)
}

function getBadgeProps(badge: keyof typeof appConfig.app.blog.categories | Badge) {
  return defu(badge, appConfig.app.blog.categories[badge as keyof typeof appConfig.app.blog.categories] as Badge)
}

function setPrimaryColor() {
  if (props.category) {
    appConfig.ui.primary = props.category.color
    window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.primary)
  }
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
      <UButton to="/blog/rss.xml" color="gray" external icon="i-ph-rss" size="2xs" target="_blank" class="mt-4 group-hover:text-blue-400 group-hover:text-green-500">
        RSS
      </UButton>
    </template>
    <div v-if="articles" class="flex flex-col gap-8">
      <div class="flex justify-between flex-wrap gap-4">
        <UHorizontalNavigation :links="categoriesWithActive" class="w-auto" />
      </div>
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
      <div class="w-full flex justify-center mt-4">
        <UPagination v-model="page" :page-count="pageCount" :total="categoryArticles.length" />
      </div>
    </div>
  </NuxtLayout>
</template>
