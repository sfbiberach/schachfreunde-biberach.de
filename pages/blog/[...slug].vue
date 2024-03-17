<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
import { defu } from 'defu'
import type { BlogPost } from '~/types'
import type { Badge } from '#ui/types'
import { useAuthors } from '~/composables/blog'

const route = useRoute()
const appConfig = useAppConfig()
const url = useRequestURL()
const { copy } = useCopyToClipboard()

const { data: article } = await useAsyncData(route.path, () => queryContent<BlogPost>(route.path).findOne())
if (!article.value)
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })

const badge = computed(() => getBadgeProps(article.value?.badge))
appConfig.ui.primary = badge.value.color

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryContent('/blog')
  .where({ _extension: 'md' })
  .without(['body', 'excerpt'])
  .sort({ date: -1 })
  .findSurround(withoutTrailingSlash(route.path)), { default: () => [] })

const title = article.value.head?.title || article.value.title
const description = article.value.head?.description || article.value.description
const authors = await useAuthors(article.value.authors)

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})

// if (post.value.image?.src) {
//   const site = useSiteConfig()

//   useSeoMeta({
//     ogImage: joinURL(site.url, post.value.image.src),
//     twitterImage: joinURL(site.url, post.value.image.src),
//   })
// }
// else {
//   defineOgImage({
//     component: 'Saas',
//     title,
//     description,
//     headline: 'Blog',
//   })
// }

function getBadgeProps(badge: keyof typeof appConfig.app.blog.badges | Badge) {
  return defu(badge, appConfig.app.blog.badges[badge as keyof typeof appConfig.app.blog.badges] as Badge)
}

function copyLink() {
  copy(`${url.origin}${article.value?._path}`, { title: 'In die Zwischenablage kopiert' })
}
</script>

<template>
  <UContainer v-if="article">
    <UPageHeader :title="article.title" :description="article.description" :ui="{ headline: 'flex flex-col gap-y-8 items-start', title: 'post-title', description: 'post-description' }">
      <template #headline>
        <UBreadcrumb :links="[{ label: 'Blog', icon: 'i-ph-newspaper-duotone', to: '/blog' }, { label: article.title }]" />
        <div class="flex items-center space-x-2">
          <UBadge v-bind="getBadgeProps(article.badge)" variant="subtle" />
          <span class="text-gray-500 dark:text-gray-400">&middot;</span>
          <time class="text-gray-500 dark:text-gray-400">{{ new Date(article.date).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
        </div>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton
          v-for="(author, index) in authors"
          :key="index"
          :to="author.to"
          color="white"
          target="_blank"
          size="sm"
        >
          <UAvatar v-bind="author.avatar" :alt="author?.name" size="2xs" />

          {{ author?.name }}
        </UButton>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody prose>
        <ContentRenderer v-if="article && article.body" :value="article" />

        <div class="flex items-center justify-between mt-12 not-prose">
          <!-- Button für Zurück zum Blog mit Icon -->
          <UButton icon="i-ph-arrow-left" color="primary" variant="ghost" to="/blog">
            Zurück zum Blog
          </UButton>
          <div class="flex justify-end items-center gap-1.5">
            <UButton icon="i-ph-link-simple-duotone" v-bind="($ui.button.secondary as any)" @click="copyLink">
              URL kopieren
            </UButton>
          </div>
        </div>

        <hr v-if="surround?.length">

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template #right>
        <UContentToc v-if="article.body && article.body.toc" :links="article.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>

<style>
/* .post-title {
  view-transition-name: post-title;
}

.post-description {
  view-transition-name: post-description;
} */
</style>
