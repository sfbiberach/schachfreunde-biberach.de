<script setup lang="ts">
import { defu } from 'defu'
import type { Badge } from '#ui/types'
import type { BlogPost } from '~/types'

const appConfig = useAppConfig()
const route = useRoute()

const { data: posts, refresh } = await useAsyncData('posts', () => queryContent<BlogPost>('/blog')
  .where({ _extension: 'md' })
  .sort({ date: -1 })
  .find())

if (posts.value) {
  for (const post of posts.value) {
    if (post.authors)
      post._authors = await useAuthors(post.authors || [])
  }
}

const query = computed(() => defu({ page: Math.max(1, Number.parseInt(route.query.page as string) || 1) }, route.query) as { page: number })
const page = ref(query.value.page)

// When route changes, update the page
watch(query, () => {
  page.value = query.value.page
})

// When page changes, update the route
watch(page, () => {
  navigateTo({ query: { page: page.value } })
  refresh()
})

const pagePosts = computed(() => {
  const start = (page.value - 1) * 12
  const end = start + 12
  return posts.value?.slice(start, end)
})

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
const active = useState()
</script>

<template>
  <div v-if="posts" class="flex flex-col gap-8">
    <UPagination v-model="page" :page-count="12" :total="posts.length" class="w-full" />
    <UBlogList>
      <UBlogPost
        v-for="(post, index) in pagePosts"
        :key="index"
        :to="post._path"
        :title="post.title"
        :description="post.description"
        :date="new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
        :authors="post._authors"
        :badge="getBadgeProps(post.badge)"
        :orientation="index === 0 ? 'horizontal' : 'vertical'"
        :class="[{ active: active === index }, index === -1 && 'col-span-full']"
        :ui="{
          title: 'post-title line-clamp-2 whitespace-normal',
          description: 'post-description line-clamp-2',
        }"
        @click="active = index"
      />
    </UBlogList>
  </div>
</template>

<style>
/* .active .post-title {
  view-transition-name: post-title;
  contain: layout;
} */

/* .active .post-description {
  view-transition-name: post-description;
  contain: layout;
} */
</style>
