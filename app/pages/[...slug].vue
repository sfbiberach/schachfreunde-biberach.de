<script setup lang="ts">
definePageMeta({
  validate: (route) => {
    const path = route.fullPath
    // Exclude paths that start with _ or /api/
    if (path.startsWith('/_') || path.startsWith('/api/')) {
      return false
    }
    // Exclude paths that look like they have file extensions (e.g., /image.jpg)
    const hasFileExtension = /^\/[^.]*\.[0-9a-z]+(?:\/.*)?$/i.test(path)
    return !hasFileExtension
  },
})

const { data: page } = await usePageContent()
</script>

<template>
  <NuxtLayout name="content">
    <ContentRenderer v-if="page" :value="page" />
  </NuxtLayout>
</template>
