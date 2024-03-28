<script setup lang="ts">
import { defu } from 'defu'
import type { Button } from '#ui/types'

export interface Props {
  container?: boolean
  description?: string
  links?: (Button & { click?: Function | undefined })[]
  prose?: boolean
  ui?: { wrapper?: string, body?: string }
  showHeader?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  container: undefined,
  prose: undefined,
  showHeader: undefined,
})

const { page: pageContent } = useContent()
const page = defu(props, pageContent.value)

const headline = computed(() => pageContent?.value?._dir ? findPageHeadline(pageContent?.value) : '')

useSeoMeta({
  title: page.title,
})

const pageBodyWrapper = computed(() => page.showHeader ? '' : 'mt-0')
</script>

<template>
  <UMain :class="page.ui?.wrapper" class="break-words">
    <UContainer :ui="{ padding: page?.container ? undefined : '', constrained: page.container ? undefined : '' }">
      <UPageHero v-if="page?.showHeader !== false" :title="page?.title" :links="page?.links" :headline="headline">
        <template #description>
          <p>{{ page.description }}</p>
          <slot name="description" />
        </template>
      </UPageHero>

      <UPageBody :prose="page?.prose !== false" class="pb-32" :ui="{ wrapper: pageBodyWrapper }" :class="[page.ui?.body]">
        <slot />
      </UPageBody>
    </UContainer>
  </UMain>
</template>
