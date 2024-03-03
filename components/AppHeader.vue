<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <UHeader class="page-header" :links="appConfig.links.header">
    <template #logo>
      <div class="flex gap-2 items-center">
        <UIcon name="i-ph-horse-duotone" class="text-3xl" />
        SF HN-Biberach
      </div>
    </template>

    <template #panel>
      <UAsideLinks :links="appConfig.links.header" />
    </template>

    <template #right>
      <UTooltip :text="$colorMode.preference === 'dark' ? 'Zu Lichtmodus wechseln' : 'Zu Dunkelmodus wechseln'">
        <UColorModeButton />
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
