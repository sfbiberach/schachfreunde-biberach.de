<script setup lang="ts">
import { BLOG_PATHS } from '~~/constants/blog'

const url = useRequestURL()
const { copy } = useClipboard()
const route = useRoute()

const { data: article } = await useBlogArticle({ slug: route.params.slug as string })

const { data: surround } = await useAsyncData(
  `${route.path}-surround`,
  () => queryCollectionItemSurroundings('blog', route.path, { fields: ['description'] })
    .where('status', '=', 'published')
    .order('date', 'DESC'),
)

const badge = resolveBadge(article.value?.category ?? '')

const links = [
  {
    icon: 'i-ph-pen-duotone',
    label: 'Artikel bearbeiten',
    to: `https://github.com/sfbiberach/schachfreunde-biberach.de/edit/main/content/${article.value?.path}`,
    target: '_blank',
  },
]

function copyLink() {
  copy(`${url.origin}${article.value?.path}`, { title: 'Link in Zwischenablage kopiert', icon: 'i-lucide-copy-check' })
}

onMounted(() => {
  usePrimaryColor(badge.color)
})
</script>

<template>
  <NuxtLayout name="article" :links>
    <ContentRenderer v-if="article?.body" :value="article" />

    <div class="flex items-center justify-between mt-12 not-prose">
      <UButton icon="i-ph-arrow-left" color="primary" variant="ghost" :to="BLOG_PATHS.BASE">
        Zurück zum Blog
      </UButton>
      <div class="flex justify-end items-center gap-1.5">
        <UButton icon="i-ph-link-simple-duotone" variant="ghost" color="neutral" @click="copyLink">
          URL kopieren
        </UButton>
      </div>
    </div>

    <USeparator v-if="surround?.length" />

    <UContentSurround :surround />
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
