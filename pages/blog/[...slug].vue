<script setup lang="ts">
const route = useRoute()
const routePaths = route.path.split('/').filter(Boolean)
const id = routePaths.at(-1) || ''

const idNumber = routePaths.length < 2 ? 1 : Number.parseInt(id || '1')
const page = Number.isNaN(idNumber) ? id : idNumber
</script>

<template>
  <template v-if="routePaths.length < 2 || typeof page === 'number'">
    <BlogList :page="(page as number)" />
  </template>
  <template v-else>
    <BlogArticle :path="page" />
  </template>
</template>
