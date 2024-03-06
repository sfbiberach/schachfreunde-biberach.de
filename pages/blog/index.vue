<script lang="ts" setup>
const { data: page } = await useAsyncData('/blog', () => queryContent('/blog').findOne())
</script>

<template>
  <NuxtLayout>
    <ULandingSection v-bind="page?.blog">
      <BlogList />
    </ULandingSection>
  </NuxtLayout>
</template>
