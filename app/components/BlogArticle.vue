<script setup lang="ts">
import type { BlogArticle } from '~~/types'
import { BLOG_PATHS } from '~~/constants/blog'
import { withoutTrailingSlash } from 'ufo'
import { useAuthors } from '~/composables/blog/useAuthors'

const route = useRoute()
const url = useRequestURL()
const { copy } = useCopyToClipboard()
const { data: article } = await useAsyncData(route.path, () => queryContent<BlogArticle>(route.path).findOne())

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel nicht gefunden' })
}

const { data: surround } = await useAsyncData(`${route.path}.surround`, () => queryContent(BLOG_PATHS.BASE)
  .where({ _extension: 'md' })
  .without(['body', 'excerpt'])
  .sort({ date: -1 })
  .findSurround(withoutTrailingSlash(route.path)), { default: () => [] })

const title = article.value.head?.title || article.value.title
const description = article.value.head?.description || article.value.description
const { authors } = await useAuthors(article.value.authors)

const links = [
  {
    icon: 'i-ph-pen-duotone',
    label: 'Artikel bearbeiten',
    to: `https://github.com/sfbiberach/schachfreunde-biberach.de/edit/main/content/${article.value._file}`,
    target: '_blank',
  },
]

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

function copyLink() {
  copy(`${url.origin}${article.value?._path}`, { title: 'In die Zwischenablage kopiert' })
}
</script>

<template>
  <NuxtLayout name="article" :container="true" :authors>
    <UPage v-if="article">
      <UPageBody prose>
        <ContentRenderer v-if="article?.body" :value="article" />

        <div class="flex items-center justify-between mt-12 not-prose">
          <UButton icon="i-ph-arrow-left" color="primary" variant="ghost" :to="BLOG_PATHS.BASE">
            Zurück zum Blog
          </UButton>
          <div class="flex justify-end items-center gap-1.5">
            <UButton icon="i-ph-link-simple-duotone" v-bind="($ui.button.secondary as any)" @click="copyLink">
              URL kopieren
            </UButton>
          </div>
        </div>

        <hr v-if="surround?.length">

        <UContentSurround :surround />
      </UPageBody>

      <template #right>
        <UContentToc :links="article?.body?.toc?.links ?? []" class="bg-transparent">
          <template #bottom>
            <UDivider v-if="article?.body?.toc?.links?.length" type="dashed" class="py-2 hidden lg:block" />
            <UPageLinks title="Links" :links="links" class="hidden lg:block" />
          </template>
        </UContentToc>
      </template>
    </UPage>
  </NuxtLayout>
</template>

<style scoped>
.top-\[--header-height\] {
  top: var(--header-height);
}

.max-h-\[calc\(100vh-var\(--header-height\)\)\] {
  max-height: calc(100vh - var(--header-height));
}
</style>
