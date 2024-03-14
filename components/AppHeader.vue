<script setup lang="ts">
const appConfig = useAppConfig()
const { metaSymbol } = useShortcuts()
</script>

<template>
  <UHeader class="page-header" :links="appConfig.links.header">
    <template #logo>
      <div class="flex gap-2 items-center">
        <UIcon name="i-ph-horse-duotone" class="text-3xl" />
        <!-- <Logo class="h-7" /> -->
        SF HN-Biberach
      </div>
    </template>

    <template #panel>
      <UAsideLinks :links="appConfig.links.header" />
    </template>

    <template #right>
      <UTooltip :text="$colorMode.preference === 'dark' ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'">
        <UColorModeButton />
      </UTooltip>
      <UTooltip text="Suche" :shortcuts="[metaSymbol, 'K']" :popper="{ strategy: 'absolute' }">
        <UContentSearchButton label="" />
      </UTooltip>
    </template>
  </UHeader>
</template>

<style>
.page-header {
  view-transition-name: page-header;
  contain: layout;
}
</style>
