<script setup lang="ts">
import type { LeagueTeamSnapshot } from '../../../shared/types/league'

definePageMeta({
  heroBackground: 'opacity-50',
})

const route = useRoute()
const { data: page } = await usePageContent({
  collection: 'team',
})
const leagueEndpoint = computed(() => `/api/teams/${String(route.params.slug)}`)
const { data: league, error: leagueError, status: leagueStatus } = await useFetch<LeagueTeamSnapshot>(leagueEndpoint, {
  deep: false,
})
</script>

<template>
  <NuxtLayout name="article" collection="team">
    <ContentRenderer v-if="page" :value="page" />

    <div v-if="leagueStatus === 'pending'" class="not-prose mt-12 space-y-4" aria-label="Mannschaftsdaten werden geladen">
      <USkeleton class="h-8 w-48" />
      <USkeleton class="h-32 w-full" />
      <USkeleton class="h-64 w-full" />
    </div>

    <TeamCompetition v-else-if="league" :team="league" />

    <UAlert
      v-else-if="leagueError && page?.league"
      class="not-prose mt-12"
      color="warning"
      variant="subtle"
      icon="i-ph-warning-circle-duotone"
      title="Mannschaftsdaten derzeit nicht verfügbar"
      description="Die aktuellen Daten konnten nicht von nuLiga geladen werden. Bitte versuche es später erneut oder öffne die Quelle direkt."
      :actions="[{
        label: 'Bei nuLiga öffnen',
        to: page.league.groupUrl,
        target: '_blank',
        color: 'neutral',
        variant: 'outline',
      }]"
    />
  </NuxtLayout>
</template>
