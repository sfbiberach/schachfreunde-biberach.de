<script setup lang="ts">
const links = [
  {
    label: 'Über uns',
    icon: 'i-ph-user-duotone',
    to: '/ueber-uns',
  },
  {
    label: 'Restaurierungen',
    description: 'Fachgemäße Restaurierung von historischen Gebäuden, Baudenkmalen und Bildhauerarbeiten.',
    icon: 'i-ph-bank-duotone',
    to: '/restaurierungen',
  },
  {
    label: 'Grabmale',
    description: 'Ein sichtbares und individuelles Andenken an einen geliebten Menschen.',
    icon: 'i-ph-cross-duotone',
    to: '/grabmale',
  },
  {
    label: 'Galerie',
    icon: 'i-ph-image-duotone',
    to: '/galerie',
  },

]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <Logo class="w-auto h-10" />
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
