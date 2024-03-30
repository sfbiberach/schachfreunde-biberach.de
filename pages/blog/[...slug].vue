<script setup lang="ts">
const route = useRoute()
const routePaths = route.path
</script>

<template>
  <BlogArticle :path="routePaths" />
</template>
