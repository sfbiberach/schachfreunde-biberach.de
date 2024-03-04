<script lang="ts" setup>
const { data: page } = await useAsyncData('blog', () => queryContent('/blog').findOne())

useSeoMeta({
  title: page.value?.title,
})
</script>

<template>
  <ULandingSection v-bind="page?.blog">
    <BlogList />
  </ULandingSection>
</template>
