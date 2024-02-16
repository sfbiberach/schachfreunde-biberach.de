<script setup lang="ts">
import { defu } from 'defu'
import type { Badge } from '#ui/types'
import type { BlogPost } from '~/types'

const appConfig = useAppConfig()

const { data: posts } = await useAsyncData('posts', () => queryContent<BlogPost>('/blog')
  .where({ _extension: 'md' })
  .sort({ date: -1 })
  .find())

const page = ref(1)

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
        :authors="post.authors"
        :badge="getBadgeProps(post.badge)"
        :orientation="index === 0 ? 'horizontal' : 'vertical'"
        :class="[index === -1 && 'col-span-full']"
        :ui="{
          description: 'line-clamp-2',
        }"
      />
    </UBlogList>
  </div>
</template>
