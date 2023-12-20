<script setup lang="ts">
const { page } = useContent()
const headline = computed(() => findPageHeadline(page.value))
</script>

<template>
  <UMain>
    <UContainer :ui="{ padding: page?.container ? undefined : '', constrained: page?.container ? undefined : '' }">
      <UPageHeader v-if="page.showHeader !== false" :title="page.title" :description="page.description" :links="page.links" :headline="headline" />
      <slot />
    </UContainer>
  </UMain>
</template>
