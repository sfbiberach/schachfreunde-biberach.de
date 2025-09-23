<script setup lang="ts">
import type { BadgeProps, BreadcrumbItem } from '#ui/types'
import type { PageLink } from '@nuxt/ui'
import { BLOG_PATHS } from '~~/constants/blog'

const props = defineProps<{
  path?: string
  links?: PageLink[]
  breadcrumbs?: BreadcrumbItem[]
}>()

const appConfig = useAppConfig()
const route = useRoute()
const path = computed(() => props.path || route.path)

const { data: page } = await usePageContent({ path: path.value, collection: 'article' })
const authors = await resolveAuthors(page.value?.authors || [])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: `Article ${props.path || route.path} not found`, fatal: true })
}

usePageSeo(page)
const { containerClass } = usePageLayout(page)

const badge = computed(() => {
  if (typeof page.value?.category === 'string') {
    const category = page.value?.category as keyof typeof appConfig.app.blog.categories
    return appConfig.app.blog.categories[category]
  }
  return { label: page.value?.category ?? '', color: 'neutral' } as BadgeProps
})
</script>

<template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <AppHeader />

  <UMain v-if="page" :ui="page.ui?.main" class="break-words">
    <UPageHero
      v-if="page.hero"
      v-bind="page.hero"
    >
      <template #description>
        <slot name="description">
          <p>{{ page.hero.description }}</p>
        </slot>
      </template>
    </UPageHero>

    <UContainer :ui="page?.ui?.container ?? {}" :class="[containerClass]">
      <UPageHeader
        v-if="page.header"
        v-bind="page.header"
        :ui="{ headline: 'flex flex-col gap-y-8 items-start' }"
      >
        <template #headline>
          <UBreadcrumb
            :ui="{ root: 'max-w-full' }"
            :items="props.breadcrumbs ?? [
              { label: 'Blog', to: BLOG_PATHS.BASE, icon: appConfig.app.icons.article ?? 'i-lucide:newspaper' },
              { label: page.title, to: page.path },
            ]"
          />
          <div class="flex items-center space-x-2">
            <template v-if="badge?.label">
              <span>{{ badge.label }}</span>
              <span class="text-gray-500 dark:text-gray-400">&middot;</span>
            </template>
            <time v-if="page.date" class="text-gray-500 dark:text-gray-400">
              {{ [page?.date, page?.dateEnd].filter(Boolean).map(d => formatDate(d)).join(' - ') }}
            </time>
          </div>
        </template>
        <div class="mt-4 flex flex-wrap items-center gap-6">
          <UUser v-for="(author, index) in authors" :key="index" v-bind="author" :description="author.to ? `@${author.to.split('/').pop()}` : undefined" target="_blank" />
          <slot name="header" />
        </div>
      </UPageHeader>

      <UPage>
        <UPageBody
          :prose="page.layout?.prose !== false"
          :class="page.ui?.body"
        >
          <slot />
        </UPageBody>

        <!-- Table of Contents -->
        <template v-if="page.layout?.toc !== false || $slots.right" #right>
          <UContentToc
            title="Inhaltsverzeichnis"
            :links="page?.body?.toc?.links"
            :ui="{ container: page?.body?.toc?.links?.length ? '' : 'border-none' }"
          >
            <template v-if="props.links" #bottom>
              <USeparator v-if="page?.body?.toc?.links?.length" type="dashed" class="py-2 hidden lg:block" />
              <UPageLinks v-if="props.links" title="Links" :links="props.links" />
            </template>
          </UContentToc>
          <slot name="right" />
        </template>
      </UPage>
    </UContainer>
  </UMain>

  <AppFooter />
</template>
