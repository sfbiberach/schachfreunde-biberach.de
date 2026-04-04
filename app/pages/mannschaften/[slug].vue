<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-50',
})

const { data: page } = await usePageContent({
  collection: 'team',
})
</script>

<template>
  <NuxtLayout name="article" collection="team">
    <ContentRenderer v-if="page" :value="page" />
  </NuxtLayout>
</template>
