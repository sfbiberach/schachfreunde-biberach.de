<script setup lang="ts">
import type { TableColumn, TabsItem } from '@nuxt/ui'
import type { LeagueMatch, LeaguePlayer, LeagueTeamSnapshot } from '../../../shared/types/league'

const props = defineProps<{
  team: LeagueTeamSnapshot
}>()

const route = useRoute()
const today = getBerlinDateKey()
const upcomingMatches = computed(() => props.team.matches
  .filter(match => match.status === 'scheduled')
  .toSorted((left, right) => left.date.localeCompare(right.date)))
const completedMatches = computed(() => props.team.matches
  .filter(match => match.status === 'finished')
  .toSorted((left, right) => right.date.localeCompare(left.date)))
const nextMatch = computed(() => upcomingMatches.value.find(match => match.date >= today))
const starters = computed(() => props.team.players.filter(player => player.role === 'starter'))
const reserves = computed(() => props.team.players.filter(player => player.role === 'reserve'))

const tabItems = computed<TabsItem[]>(() => [
  {
    label: 'Spiele',
    icon: 'i-ph-calendar-duotone',
    value: 'matches',
    slot: 'matches',
    badge: props.team.matches.length,
  },
  {
    label: 'Aufstellung',
    icon: 'i-ph-users-three-duotone',
    value: 'lineup',
    slot: 'lineup',
    badge: props.team.players.length,
  },
])

const activeTab = computed<string | number>({
  get: () => route.query.bereich === 'aufstellung' ? 'lineup' : 'matches',
  set: (value) => {
    void navigateTo({
      query: {
        ...route.query,
        bereich: value === 'lineup' ? 'aufstellung' : undefined,
      },
    }, { replace: true })
  },
})

const matchColumns: TableColumn<LeagueMatch>[] = [
  {
    accessorKey: 'date',
    header: 'Datum',
    meta: { class: { th: 'w-36', td: 'align-top' } },
  },
  { id: 'pairing', header: 'Begegnung' },
  {
    accessorKey: 'round',
    header: 'Runde',
    meta: { class: { th: 'hidden lg:table-cell w-20', td: 'hidden lg:table-cell' } },
  },
  {
    accessorKey: 'result',
    header: 'Ergebnis',
    meta: { class: { th: 'text-right w-28', td: 'text-right align-top' } },
  },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'hidden sm:table-cell w-12', td: 'hidden sm:table-cell text-right' } },
  },
]

const playerColumns: TableColumn<LeaguePlayer>[] = [
  { accessorKey: 'board', header: 'Brett', meta: { class: { th: 'w-20', td: 'font-medium' } } },
  { accessorKey: 'name', header: 'Spieler' },
  { accessorKey: 'rating', header: 'DWZ', meta: { class: { th: 'text-right w-24', td: 'text-right' } } },
  {
    accessorKey: 'appearances',
    header: 'Einsätze',
    meta: { class: { th: 'hidden sm:table-cell text-right w-24', td: 'hidden sm:table-cell text-right' } },
  },
  {
    accessorKey: 'boardPoints',
    header: 'Brettpunkte',
    meta: { class: { th: 'hidden md:table-cell text-right w-32', td: 'hidden md:table-cell text-right' } },
  },
]

function outcome(match: LeagueMatch) {
  const value = getMatchOutcome(match, props.team.team.name)
  if (value === 'win') {
    return { label: 'Sieg', color: 'success' as const }
  }
  if (value === 'loss') {
    return { label: 'Niederlage', color: 'error' as const }
  }
  if (value === 'draw') {
    return { label: 'Remis', color: 'neutral' as const }
  }
  return null
}
</script>

<template>
  <div class="not-prose mt-12 space-y-8">
    <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0', footer: 'py-3 sm:py-3' }">
      <dl class="grid grid-cols-2 divide-x divide-y divide-default sm:grid-cols-4 sm:divide-y-0">
        <div class="space-y-1 p-4 sm:p-5">
          <dt class="flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-ph-trophy-duotone" class="size-4 shrink-0" />
            Liga
          </dt>
          <dd class="font-semibold text-highlighted">
            {{ team.team.competition ?? 'Mannschaftswettbewerb' }}
          </dd>
        </div>
        <div class="space-y-1 p-4 sm:p-5">
          <dt class="flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-ph-calendar-blank-duotone" class="size-4 shrink-0" />
            Saison
          </dt>
          <dd class="font-semibold text-highlighted">
            {{ team.season }}
          </dd>
        </div>
        <div class="space-y-1 p-4 sm:p-5">
          <dt class="flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-ph-users-three-duotone" class="size-4 shrink-0" />
            Spieler
          </dt>
          <dd class="font-semibold text-highlighted">
            {{ team.players.length }}
          </dd>
        </div>
        <div class="space-y-1 p-4 sm:p-5">
          <dt class="flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-ph-calendar-check-duotone" class="size-4 shrink-0" />
            Spiele
          </dt>
          <dd class="font-semibold text-highlighted">
            {{ team.matches.length }}
          </dd>
        </div>
      </dl>

      <template #footer>
        <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <span>Aktualisiert {{ formatLeagueDateTime(team.fetchedAt) }}</span>
          <UButton
            :to="team.sourceUrl"
            target="_blank"
            color="neutral"
            variant="link"
            size="sm"
            trailing-icon="i-lucide-external-link"
            label="Quelle: nuLiga"
          />
        </div>
      </template>
    </UCard>

    <UTabs
      v-model="activeTab"
      :items="tabItems"
      variant="link"
      :unmount-on-hide="false"
      :ui="{
        list: 'w-full border-b border-default',
        trigger: 'flex-1 sm:flex-none',
        content: 'pt-8',
      }"
    >
      <template #matches>
        <div class="space-y-10">
          <section v-if="nextMatch" aria-labelledby="next-match-heading">
            <h2 id="next-match-heading" class="mb-4 text-2xl font-bold text-highlighted">
              Nächstes Spiel
            </h2>
            <UCard variant="subtle">
              <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2 text-sm text-muted">
                    <UIcon name="i-ph-calendar-duotone" class="size-5" />
                    <span>{{ formatLeagueDate(nextMatch.date) }}<template v-if="nextMatch.time">, {{ nextMatch.time }} Uhr</template></span>
                    <UBadge v-if="nextMatch.round" color="neutral" variant="subtle" :label="`${nextMatch.round}. Runde`" />
                  </div>
                  <p class="text-lg font-semibold text-highlighted">
                    {{ nextMatch.home }} <span class="font-normal text-muted">–</span> {{ nextMatch.away }}
                  </p>
                </div>
                <UBadge
                  color="primary"
                  variant="subtle"
                  :label="nextMatch.home === team.team.name ? 'Heimspiel' : 'Auswärtsspiel'"
                />
              </div>
            </UCard>
          </section>

          <section aria-labelledby="matches-heading">
            <div class="mb-6">
              <h2 id="matches-heading" class="text-2xl font-bold text-highlighted">
                Spielplan und Ergebnisse
              </h2>
              <p class="mt-1 text-sm text-muted">
                Alle Begegnungen der Saison {{ team.season }}.
              </p>
            </div>

            <div v-if="upcomingMatches.length" class="space-y-3">
              <h3 class="text-lg font-semibold text-highlighted">
                Kommende Spiele
              </h3>
              <ul class="divide-y divide-default overflow-hidden rounded-lg border border-default md:hidden">
                <li v-for="match in upcomingMatches" :key="match.id" class="space-y-2 p-4">
                  <div class="flex items-center justify-between gap-3 text-sm text-muted">
                    <span>{{ formatLeagueDate(match.date) }}<template v-if="match.time">, {{ match.time }} Uhr</template></span>
                    <UBadge v-if="match.round" color="neutral" variant="subtle" size="sm" :label="`${match.round}. Runde`" />
                  </div>
                  <p class="text-sm text-highlighted">
                    <span :class="match.home === team.team.name ? 'font-semibold' : ''">{{ match.home }}</span>
                    <span class="mx-1 text-muted">–</span>
                    <span :class="match.away === team.team.name ? 'font-semibold' : ''">{{ match.away }}</span>
                  </p>
                </li>
              </ul>
              <UCard class="hidden md:block" variant="subtle" :ui="{ body: 'p-0 sm:p-0' }">
                <UTable :data="upcomingMatches" :columns="matchColumns">
                  <template #date-cell="{ row }">
                    <div class="whitespace-nowrap">
                      <div>{{ formatLeagueDate(row.original.date) }}</div>
                      <div v-if="row.original.time" class="text-xs text-muted">
                        {{ row.original.time }} Uhr
                      </div>
                    </div>
                  </template>
                  <template #pairing-cell="{ row }">
                    <span :class="row.original.home === team.team.name ? 'font-semibold text-highlighted' : ''">{{ row.original.home }}</span>
                    <span class="mx-1 text-muted">–</span>
                    <span :class="row.original.away === team.team.name ? 'font-semibold text-highlighted' : ''">{{ row.original.away }}</span>
                  </template>
                  <template #result-cell>
                    <span class="text-muted">offen</span>
                  </template>
                </UTable>
              </UCard>
            </div>

            <div v-if="completedMatches.length" :class="upcomingMatches.length ? 'mt-8' : ''" class="space-y-3">
              <h3 class="text-lg font-semibold text-highlighted">
                Ergebnisse
              </h3>
              <ul class="divide-y divide-default overflow-hidden rounded-lg border border-default md:hidden">
                <li v-for="match in completedMatches" :key="match.id" class="space-y-2 p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div class="text-sm text-muted">
                      <div>{{ formatLeagueDate(match.date) }}</div>
                      <div v-if="match.time" class="text-xs">
                        {{ match.time }} Uhr
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-1">
                      <span class="font-semibold text-highlighted">{{ match.result }}</span>
                      <UBadge
                        v-if="outcome(match)"
                        size="sm"
                        variant="subtle"
                        :color="outcome(match)?.color"
                        :label="outcome(match)?.label"
                      />
                    </div>
                  </div>
                  <div class="flex items-end justify-between gap-3">
                    <p class="text-sm text-highlighted">
                      <span :class="match.home === team.team.name ? 'font-semibold' : ''">{{ match.home }}</span>
                      <span class="mx-1 text-muted">–</span>
                      <span :class="match.away === team.team.name ? 'font-semibold' : ''">{{ match.away }}</span>
                    </p>
                    <UButton
                      v-if="match.reportUrl"
                      :to="match.reportUrl"
                      target="_blank"
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      icon="i-lucide-external-link"
                      aria-label="Spielbericht bei nuLiga öffnen"
                    />
                  </div>
                </li>
              </ul>
              <UCard class="hidden md:block" variant="subtle" :ui="{ body: 'p-0 sm:p-0' }">
                <UTable :data="completedMatches" :columns="matchColumns">
                  <template #date-cell="{ row }">
                    <div class="whitespace-nowrap">
                      <div>{{ formatLeagueDate(row.original.date) }}</div>
                      <div v-if="row.original.time" class="text-xs text-muted">
                        {{ row.original.time }} Uhr
                      </div>
                    </div>
                  </template>
                  <template #pairing-cell="{ row }">
                    <span :class="row.original.home === team.team.name ? 'font-semibold text-highlighted' : ''">{{ row.original.home }}</span>
                    <span class="mx-1 text-muted">–</span>
                    <span :class="row.original.away === team.team.name ? 'font-semibold text-highlighted' : ''">{{ row.original.away }}</span>
                  </template>
                  <template #result-cell="{ row }">
                    <div class="flex flex-col items-end gap-1">
                      <span class="font-semibold text-highlighted">{{ row.original.result }}</span>
                      <UBadge
                        v-if="outcome(row.original)"
                        size="sm"
                        variant="subtle"
                        :color="outcome(row.original)?.color"
                        :label="outcome(row.original)?.label"
                      />
                    </div>
                  </template>
                  <template #actions-cell="{ row }">
                    <UButton
                      v-if="row.original.reportUrl"
                      :to="row.original.reportUrl"
                      target="_blank"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-external-link"
                      aria-label="Spielbericht bei nuLiga öffnen"
                    />
                  </template>
                </UTable>
              </UCard>
            </div>

            <UEmpty
              v-if="!upcomingMatches.length && !completedMatches.length"
              icon="i-ph-calendar-blank-duotone"
              title="Keine Spiele verfügbar"
              description="Für diese Mannschaft sind derzeit keine Spieltermine hinterlegt."
            />
          </section>
        </div>
      </template>

      <template #lineup>
        <section aria-labelledby="lineup-heading">
          <div class="mb-6">
            <h2 id="lineup-heading" class="text-2xl font-bold text-highlighted">
              Mannschaftsaufstellung
            </h2>
            <p class="mt-1 text-sm text-muted">
              Gemeldete Spieler und ihre bisherigen Einsätze.
            </p>
          </div>

          <div class="space-y-8">
            <div v-if="starters.length" class="space-y-3">
              <h3 class="text-lg font-semibold text-highlighted">
                Stammspieler
              </h3>
              <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0' }">
                <UTable :data="starters" :columns="playerColumns">
                  <template #rating-cell="{ row }">
                    {{ row.original.rating ?? '–' }}
                  </template>
                  <template #appearances-cell="{ row }">
                    {{ row.original.appearances ?? '–' }}
                  </template>
                  <template #boardPoints-cell="{ row }">
                    {{ row.original.boardPoints ?? '–' }}
                  </template>
                </UTable>
              </UCard>
            </div>

            <div v-if="reserves.length" class="space-y-3">
              <h3 class="text-lg font-semibold text-highlighted">
                Ersatzspieler
              </h3>
              <UCard variant="subtle" :ui="{ body: 'p-0 sm:p-0' }">
                <UTable :data="reserves" :columns="playerColumns">
                  <template #rating-cell="{ row }">
                    {{ row.original.rating ?? '–' }}
                  </template>
                  <template #appearances-cell="{ row }">
                    {{ row.original.appearances ?? '–' }}
                  </template>
                  <template #boardPoints-cell="{ row }">
                    {{ row.original.boardPoints ?? '–' }}
                  </template>
                </UTable>
              </UCard>
            </div>
          </div>
        </section>
      </template>
    </UTabs>
  </div>
</template>
