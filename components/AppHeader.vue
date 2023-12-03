<script setup lang="ts">
const links = [
  {
    label: 'Aktuelles',
    icon: 'i-ph-newspaper-duotone',
    to: '/',
  },
  {
    label: 'Verein',
    icon: 'i-ph-horse-duotone',
    to: '/verein',
  },
  {
    label: 'Mannschaften',
    icon: 'i-ph-castle-turret-duotone',
    to: '/mannschaften',
  },
  {
    label: 'Turniere',
    icon: 'i-ph-trophy-duotone',
    to: '/turniere',
  },
]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <div class="flex gap-2 items-center">
        <UIcon name="i-ph-horse-duotone" class="text-3xl" />
        Sfr. HN-Biberach 1978 e.&nbsp;V.
      </div>
    </template>

    <template #panel>
      <UAsideLinks :links="links" />

      <UDivider class="my-6" />

      <UButton label="Kontakt" block />
    </template>

    <template #right>
      <UButton label="Kontakt" color="black" class="hidden lg:flex" />
    </template>
  </UHeader>
</template>
