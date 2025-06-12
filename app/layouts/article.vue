<script setup lang="ts">
import type { BadgeProps } from '#ui/types'
import type { PageLink } from '@nuxt/ui-pro'
import { BLOG_PATHS } from '~~/constants/blog'

const props = defineProps<{
  path?: string
  links?: PageLink[]
}>()

const appConfig = useAppConfig()
const route = useRoute()
const path = computed(() => props.path || route.path)

const { data: page } = await usePageContent({ path: path.value, collection: 'blog' })
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

    <UContainer :ui="{ ...page.ui?.container }" :class="[containerClass]">
      <UPageHeader
        v-if="page.header"
        v-bind="page.header"
        :ui="{ headline: 'flex flex-col gap-y-8 items-start' }"
      >
        <template #headline>
          <UBreadcrumb
            :ui="{ root: 'max-w-full' }"
            :items="[{ label: 'Blog', icon: 'i-ph-newspaper-duotone', to: BLOG_PATHS.BASE }, { label: page.title }]"
          />
          <div class="flex items-center space-x-2">
            <span>{{ badge.label }}</span>
            <span class="text-gray-500 dark:text-gray-400">&middot;</span>
            <time class="text-gray-500 dark:text-gray-400">
              {{ new Date(page.date || 0).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' }) }}
            </time>
          </div>
        </template>
        <div class="flex flex-wrap items-center gap-3 mt-4">
          <UButton
            v-for="(author, index) in authors"
            :key="index"
            :to="author.to"
            target="_blank"
            color="neutral"
            variant="ghost"
            class="-my-1.5 -mx-2.5"
          >
            <UAvatar v-bind="author?.avatar" :alt="author?.name" />
            <div class="text-left">
              <p class="font-medium">
                {{ author?.name }}
              </p>
              <p v-if="author?.to" class="text-gray-500 dark:text-gray-400 leading-4">
                {{ `@${author.to.split('/').filter(Boolean).pop()}` }}
              </p>
            </div>
          </UButton>
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
            :ui="{ container: page?.body?.toc?.links?.length ? '' : 'border-none p-0!' }"
          >
            <template #bottom>
              <USeparator v-if="page?.body?.toc?.links?.length" type="dashed" class="py-2 hidden lg:block" />
              <UPageLinks title="Links" :links="props.links" />
            </template>
          </UContentToc>
          <slot name="right" />
        </template>
      </UPage>
    </UContainer>
  </UMain>

  <AppFooter />
</template>
