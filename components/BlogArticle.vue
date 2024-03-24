<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
import { defu } from 'defu'
import type { BlogArticle } from '~/types'
import type { Badge } from '#ui/types'

const props = defineProps<{
  path: string
}>()

const appConfig = useAppConfig()
const url = useRequestURL()
const { copy } = useCopyToClipboard()

// const { data: article } = await useAsyncData(route.path, () => queryContent<BlogArticle>(route.path).findOne())
const { data: article } = await useFetch<BlogArticle>(`/api/blog/${props.path}`)

if (!article.value)
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: false })

const badge = computed(() => getBadgeProps(article.value?.badge))
usePrimaryColor(badge.value.color)

const title = article.value.head?.title || article.value.title
const description = article.value.head?.description || article.value.description

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

function getBadgeProps(badge: keyof typeof appConfig.app.blog.categories | Badge) {
  return defu(badge, appConfig.app.blog.categories[badge as keyof typeof appConfig.app.blog.categories] as Badge)
}

function copyLink() {
  copy(`${url.origin}${article.value?._path}`, { title: 'In die Zwischenablage kopiert' })
}
</script>

<template>
  <NuxtLayout name="article" :container="true" :authors="article?.authors">
    <UPage v-if="article">
      <UPageBody prose>
        <ContentRenderer v-if="article && article.body" :value="article" />

        <div class="flex items-center justify-between mt-12 not-prose">
          <UButton icon="i-ph-arrow-left" color="primary" variant="ghost" to="/blog">
            Zurück zum Blog
          </UButton>
          <div class="flex justify-end items-center gap-1.5">
            <UButton icon="i-ph-link-simple-duotone" v-bind="($ui.button.secondary as any)" @click="copyLink">
              URL kopieren
            </UButton>
          </div>
        </div>

        <hr v-if="article.surround?.length">

        <UContentSurround :surround="article.surround" />
      </UPageBody>

      <template #right>
        <UContentToc v-if="article.body && article.body.toc" :links="article.body.toc.links" />
      </template>
    </UPage>
  </NuxtLayout>
</template>
