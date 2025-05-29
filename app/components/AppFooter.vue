<script setup lang="ts">
const appConfig = useAppConfig()
const footerButtons = appConfig?.app?.meta?.socials
</script>

<template>
  <USeparator icon="i-ph-crown-cross-duotone" class="h-px" />

  <UFooter>
    <template #top>
      <UContainer>
        <HFooterColumns />
      </UContainer>
    </template>
    <template #left>
      <HFooterCopyright />
    </template>
    <template #right>
      <HFooterButtons :buttons="footerButtons" />
    </template>
  </UFooter>
</template>
