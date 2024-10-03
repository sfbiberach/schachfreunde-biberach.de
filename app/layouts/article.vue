<script setup lang="ts">
import type { Badge, Button } from '#ui/types'
import type { BlogArticle } from '~~/types'
import { defu } from 'defu'

export interface Props {
  authors?: { name: string, to: string, avatar: { src: string, alt: string } }[]
  container?: boolean
  links?: (Button & { click?: (() => void) | undefined })[]
  prose?: boolean
  ui?: { wrapper?: string, body?: string }
  showHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  container: undefined,
  showHeader: undefined,
})

const appConfig = useAppConfig()
const { page: pageContent } = useContent()
const page = { ...pageContent.value, ...props as typeof props & BlogArticle }

const headline = computed(() => pageContent?.value?._dir ? findPageHeadline(pageContent?.value) : '')

const badge = computed(() => getBadgeProps(page.category))

onMounted(() => {
  appConfig.ui.primary = badge.value.color
  window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.primary)
})

useSeoMeta({
  title: page.title,
})

const pageBodyWrapper = computed(() => page.showHeader ? '' : 'mt-0')

function getBadgeProps(badge: keyof typeof appConfig.app.blog.categories | Badge) {
  return defu(badge, appConfig.app.blog.categories[badge as keyof typeof appConfig.app.blog.categories] as Badge)
}
</script>

<template>
  <UMain :class="page.ui?.wrapper" class="break-words">
    <UContainer :ui="{ padding: page?.container ? undefined : '', constrained: page.container ? undefined : '' }">
      <UPageHeader v-if="page?.showHeader !== false" :ui="{ headline: 'flex flex-col gap-y-8 items-start' }" :title="page?.title" :description="page.description" :links="page?.links" :headline="headline">
        <template #headline>
          <UBreadcrumb :ui="{ wrapper: 'max-w-full' }" :links="[{ label: 'Blog', icon: 'i-ph-newspaper-duotone', to: '/blog' }, { label: page.title }]" />
          <div class="flex items-center space-x-2">
            <span>{{ badge.label }}</span>
            <span class="text-gray-500 dark:text-gray-400">&middot;</span>
            <time class="text-gray-500 dark:text-gray-400">{{ new Date(page.date || 0).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
          </div>
        </template>
        <div class="flex flex-wrap items-center gap-3 mt-4">
          <UButton
            v-for="(author, index) in page.authors"
            :key="index"
            :to="author.to"
            target="_blank"
            color="gray"
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
      <UPageBody :prose="page?.prose !== false" class="pb-32" :ui="{ wrapper: pageBodyWrapper }" :class="[page.ui?.body]">
        <slot />
      </UPageBody>
    </UContainer>
  </UMain>
</template>
