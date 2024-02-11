<script lang="ts" setup>
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())

const images = [
  { class: 'h-8' },
  { src: '/assets/blog/20180704.bw-mannschaftsfinale-u16/1561.jpg' },
  // { src: '/assets/blog/20170101.dvm-u14-2016/gruppenfoto.jpg' },
  // { src: '/assets/blog/20170101.dvm-u14-2016/gruppenfoto.jpg' },
  { src: '/assets/blog/20180704.bw-mannschaftsfinale-u16/1561.jpg' },
]
</script>

<template>
  <div v-if="page">
    <div class="relative">
      <ULandingSection v-bind="page.hero">
        <template #title>
          <span v-html="page.hero?.title" />
        </template>

        <template #description>
          <span v-html="page.hero?.description" />
        </template>

        <UPageColumns :style="{ columns: images.length > 1 ? 2 : 1 }">
          <template v-for="(image, _index) in images" :key="_index">
            <NuxtImg v-if="image.src" v-bind="image" class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700" />
            <div v-else v-bind="image" />
          </template>
        </UPageColumns>
      </ULandingSection>

      <ULandingSection :ui="{ wrapper: 'py-12 sm:py-16 bg-gradient-to-b from-transparent via-gray-900 to-gray-900' }">
        <UPageGrid>
          <ULandingCard v-for="(card, index) in page.cards" :key="index" v-bind="card" />
        </UPageGrid>
      </ULandingSection>
      <ClientOnly>
        <Chessboard class="z-[-1]" />
      </ClientOnly>
    </div>

    <ULandingSection v-bind="page.blog" id="aktuelles" :ui="{ wrapper: 'bg-gray-900' }">
      <BlogList />
    </ULandingSection>
  </div>
</template>

<style>

</style>
