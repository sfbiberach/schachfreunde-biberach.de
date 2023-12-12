<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <UHeader :links="appConfig.links.header">
    <template #logo>
      <div class="flex gap-2 items-center">
        <UIcon name="i-ph-horse-duotone" class="text-3xl" />
        Sfr. HN-Biberach 1978 e.&nbsp;V.
      </div>
    </template>

    <template #panel>
      <UAsideLinks :links="appConfig.links.header" />

      <UDivider class="my-6" />

      <UButton label="Kontakt" block />
    </template>

    <template #right>
      <UButton label="Kontakt" color="black" class="hidden lg:flex" />
    </template>
  </UHeader>
</template>
