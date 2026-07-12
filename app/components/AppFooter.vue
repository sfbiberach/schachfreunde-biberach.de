<script setup lang="ts">
const appConfig = useAppConfig()
const footerButtons = appConfig?.app?.meta?.socials
</script>

<template>
  <USeparator icon="i-ph-crown-cross-duotone" class="h-px" />

  <UFooter :ui="{ left: 'justify-center lg:justify-start!', right: 'justify-center lg:justify-end!' }">
    <template #top>
      <UContainer>
        <HFooterColumns />
      </UContainer>
    </template>
    <template #left>
      <HFooterCopyright>
        <template #copyright="{ copyrightYear, copyrightHolder }">
          <p class="text-muted text-sm text-center lg:text-left!">
            Copyright © {{ copyrightYear }} {{ copyrightHolder }}
          </p>
        </template>
      </HFooterCopyright>
    </template>
    <template #right>
      <HFooterButtons :buttons="footerButtons" />
    </template>
  </UFooter>
</template>
