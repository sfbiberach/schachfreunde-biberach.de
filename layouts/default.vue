<script setup lang="ts">
const { page } = useContent()
const headline = computed(() => page?.value?._dir ? findPageHeadline(page?.value) : '')

useSeoMeta({
  title: page.value?.title,
})

const pageBodyWrapper = computed(() => page?.value.showHeader ? '' : 'mt-0')
</script>

<template>
  <UMain :class="page?.ui?.wrapper" class="break-words">
    <UContainer :ui="{ padding: page?.container ? undefined : '', constrained: page?.container ? undefined : '' }">
      <UPageHeader v-if="page?.showHeader !== false" :title="page?.title" :description="page?.description" :links="page?.links" :headline="headline" />
      <UPageBody :prose="page?.prose !== false" class="pb-32" :ui="{ wrapper: pageBodyWrapper }" :class="[page?.ui?.body]">
        <slot />
      </UPageBody>
    </UContainer>
  </UMain>
</template>
