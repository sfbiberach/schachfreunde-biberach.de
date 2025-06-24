<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70',
})

const { data: tournaments } = await useTournaments()
</script>

<template>
  <NuxtLayout name="content">
    <UPageGrid class="mt-8">
      <UPageCard
        v-for="(tournament, index) in tournaments"
        :key="index"
        v-bind="tournament"
        :to="tournament.path"
        variant="subtle"
        :ui="{
          title: 'text-lg',
          description: 'line-clamp-3',
        }"
      >
        <template v-if="tournament?.date" #footer>
          <UBadge :label="[tournament?.date, tournament?.dateEnd].filter(Boolean).map(d => formatDate(d)).join(' - ')" color="neutral" variant="subtle" />
        </template>
      </UPageCard>
    </UPageGrid>
  </NuxtLayout>
</template>
