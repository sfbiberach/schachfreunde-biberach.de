<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70',
})

const { teams, fetchList } = useTeams()

await fetchList()
</script>

<template>
  <NuxtLayout
    title="Mannschaften"
    description="Hier findest du unsere Mannschaften und ihre aktuellen Ranglisten und Ergebnisse."
    align="center"
    :container="true"
    :prose="false"
  >
    <UPageGrid class="mt-8">
      <UPageCard
        v-for="(team, index) in teams"
        :key="index"
        :to="team.external ? team.link : team._path"
        :title="team.title"
        :description="team.description"
        :ui="{
          divide: '',
          footer: { padding: 'pt-0' },
          title: 'text-lg',
          description: 'line-clamp-3',
        }"
        :target="team.external ? '_blank' : '_self'"
      />
    </UPageGrid>
  </NuxtLayout>
</template>
