<script setup lang="ts">
import type { LeagueTeamSnapshot } from '../../../shared/types/league'
import { isLeagueSnapshotStale } from '#shared/constants/league'

const LEAGUE_REFRESH_DELAYS_MS = [1_000, 2_000, 4_000] as const

definePageMeta({
  heroBackground: 'opacity-50',
})

const route = useRoute()
const { data: page } = await usePageContent({
  collection: 'team',
})
const leagueEndpoint = computed(() => `/api/teams/${String(route.params.slug)}`)
const {
  data: league,
  error: leagueError,
  status: leagueStatus,
  refresh: refreshLeague,
} = await useFetch<LeagueTeamSnapshot>(leagueEndpoint, {
  deep: false,
})
const leagueRefreshing = ref(false)
let refreshController: AbortController | undefined
let stopLeagueWatcher: (() => void) | undefined

function waitForRefresh(delay: number, signal: AbortSignal) {
  return new Promise<boolean>((resolve) => {
    if (signal.aborted) {
      resolve(false)
      return
    }

    let timer: ReturnType<typeof setTimeout>
    const abort = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', abort)
      resolve(false)
    }

    timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      resolve(true)
    }, delay)
    signal.addEventListener('abort', abort, { once: true })
  })
}

async function refreshStaleLeague(initialFetchedAt: string, controller: AbortController) {
  leagueRefreshing.value = true

  try {
    for (const delay of LEAGUE_REFRESH_DELAYS_MS) {
      if (!await waitForRefresh(delay, controller.signal)) {
        return
      }

      await refreshLeague()

      if (controller.signal.aborted || !league.value || league.value.fetchedAt !== initialFetchedAt) {
        return
      }
    }
  }
  finally {
    if (refreshController === controller) {
      leagueRefreshing.value = false
      refreshController = undefined
    }
  }
}

onMounted(() => {
  stopLeagueWatcher = watch(
    [leagueEndpoint, () => league.value?.fetchedAt],
    ([, fetchedAt]) => {
      refreshController?.abort()
      refreshController = undefined

      if (!fetchedAt || !isLeagueSnapshotStale(fetchedAt)) {
        leagueRefreshing.value = false
        return
      }

      const controller = new AbortController()
      refreshController = controller
      void refreshStaleLeague(fetchedAt, controller)
    },
    { immediate: true },
  )
})

onScopeDispose(() => {
  stopLeagueWatcher?.()
  refreshController?.abort()
})
</script>

<template>
  <NuxtLayout name="article" collection="team">
    <ContentRenderer v-if="page" :value="page" />

    <div v-if="leagueStatus === 'pending' && !league" class="not-prose mt-12 space-y-4" aria-label="Mannschaftsdaten werden geladen">
      <USkeleton class="h-8 w-48" />
      <USkeleton class="h-32 w-full" />
      <USkeleton class="h-64 w-full" />
    </div>

    <TeamCompetition v-else-if="league" :team="league" :refreshing="leagueRefreshing" />

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
