<script setup lang="ts">
useHead({
  title: 'Schachfreunde Heilbronn-Biberach 1978 e.V.',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'de',
  },
})

useSeoMeta({
  author: 'Schachfreunde Heilbronn-Biberach 1978 e.V.',
  description: 'Schachfreunde Heilbronn-Biberach 1978 e.V. - Der Schachverein im Heilbronner Stadtteil Biberach',
  robots: 'index, follow',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
