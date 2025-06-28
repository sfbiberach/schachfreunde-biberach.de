<script setup lang="ts">
const appConfig = useAppConfig()
const items = appConfig.app.links.header

const route = useRoute()
const heroBackgroundClass = computed(() => route.meta?.heroBackground || 'opacity-30')
</script>

<template>
  <UHeader class="page-header">
    <template #title>
      <div class="flex gap-2 items-center">
        <UIcon name="i-ph-horse-duotone" class="text-3xl" />
        SF HN-Biberach
      </div>
    </template>

    <UNavigationMenu :items variant="link" :ui="{ linkLeadingIcon: 'hidden' }" />

    <template #right>
      <UColorModeButton />
      <UContentSearchButton :tooltip="{ text: 'Suche', kbds: ['meta', 'K'], content: { align: 'center', side: 'bottom' } }" />
    </template>

    <template #body>
      <UNavigationMenu :items orientation="vertical" />
    </template>
  </UHeader>

  <HeroBackground
    class="absolute w-full top-[0px] transition-all text-primary flex-shrink-0 duration-[400ms]"
    :class="[heroBackgroundClass]"
  />
</template>

<style>
.page-header {
  view-transition-name: page-header;
  contain: layout;
}
</style>
