<script setup lang="ts">
const route = useRoute()
const routePaths = route.path.split('/').filter(Boolean)
const id = routePaths.at(-1) || ''
</script>

<template>
  <BlogArticle :path="id" />
</template>
