<script setup lang="ts">
const route = useRoute()
const heroBackgroundClass = computed(() => route.meta?.heroBackground || 'opacity-30')
</script>

<template>
  <HSiteHeader
    title="SF HN-Biberach"
    class="page-header"
    :navigation="{
      variant: 'link',
      ui: { linkLeadingIcon: 'hidden' },
    }"
  >
    <template #title>
      <div class="flex gap-2 items-center">
        <UIcon name="i-ph-horse-duotone" class="text-3xl" />
        SF HN-Biberach
      </div>
    </template>

    <template #right>
      <UColorModeButton />
      <UContentSearchButton :tooltip="{ text: 'Suche', kbds: ['meta', 'K'], content: { align: 'center', side: 'bottom' } }" />
    </template>
  </HSiteHeader>

  <HeroBackground
    class="absolute w-full top-0 transition-all text-primary shrink-0 duration-400"
    :class="[heroBackgroundClass]"
  />
</template>

<style>
.page-header {
  view-transition-name: page-header;
  contain: layout;
}
</style>
