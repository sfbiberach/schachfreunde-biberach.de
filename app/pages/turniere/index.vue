<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70',
})

const appConfig = useAppConfig()

const { tournaments, fetchList } = useTournaments()

await fetchList()
</script>

<template>
  <NuxtLayout
    title="Turniere"
    description="Hier bekommst Du einen Überblick über die Schachturniere, die wir selbst ausrichten. Von Opens mit mehreren hundert Teilnehmern bis hin zu kleineren Turnieren ist für jeden etwas dabei."
    align="center"
    :container="true"
    :prose="false"
  >
    <UPageGrid class="mt-8">
      <UPageCard
        v-for="(tournament, index) in tournaments"
        :key="index"
        :to="tournament.external ? tournament.link : tournament._path"
        :title="tournament.title"
        :description="tournament.description"
        :ui="{
          divide: '',
          footer: { padding: 'pt-0' },
          title: 'text-lg',
          description: 'line-clamp-3',
        }"
        :target="tournament.external ? '_blank' : '_self'"
      >
        <template v-if="tournament.date" #footer>
          <UBadge :label="getTournamentDate(tournament)" color="gray" />
        </template>
      </UPageCard>
    </UPageGrid>
  </NuxtLayout>
</template>
