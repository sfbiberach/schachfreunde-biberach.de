<script lang="ts" setup>
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
</script>

<template>
  <div v-if="page">
    <ULandingSection v-bind="page.hero" class="relative">
      <template #title>
        <span v-html="page.hero?.title" />
      </template>

      <template #description>
        <span v-html="page.hero?.description" />
      </template>

      <NuxtImg src="/assets/blog/20170101.dvm-u14-2016/gruppenfoto.jpg" class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700" />
      <ClientOnly>
        <Tetris class="z-[-1]" />
      </ClientOnly>
    </ULandingSection>

    <ULandingSection v-bind="page.blog">
      <BlogList />
    </ULandingSection>
  </div>
</template>

<style>

</style>
