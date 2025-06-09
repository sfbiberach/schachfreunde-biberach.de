<script setup lang="ts">
const appConfig = useAppConfig()
const items = appConfig.app.links.header
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
      <UTooltip :text="$colorMode.preference === 'dark' ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'" :popper="{ strategy: 'absolute' }">
        <UColorModeButton />
      </UTooltip>
      <UTooltip text="Suche" :kbds="['meta', 'K']" :popper="{ strategy: 'absolute' }">
        <UContentSearchButton label="" />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu :items orientation="vertical" />
    </template>
  </UHeader>
</template>

<style>
.page-header {
  view-transition-name: page-header;
  contain: layout;
}
</style>
