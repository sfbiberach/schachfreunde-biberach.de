<script lang="ts" setup>
const { data: page } = await useAsyncData('blog', () => queryContent('/blog').findOne())
</script>

<template>
  <ULandingSection v-bind="page?.blog">
    <BlogList />
  </ULandingSection>
</template>
