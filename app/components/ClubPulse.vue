<script setup lang="ts">
import type { ClubPulseResponse, ClubPulseTeamMatch } from '~~/shared/types/clubPulse'
import type { NextTraining } from '~~/shared/types/training'

interface TournamentHighlight {
  title: string
  description?: string
  date: string
  dateEnd?: string
  path: string
}

const props = defineProps<{
  pulse?: ClubPulseResponse | null
  tournament?: TournamentHighlight | null
  training?: NextTraining | null
  refreshing?: boolean
}>()

const recentMatch = computed(() => props.pulse?.recentMatches[0])
const upcomingMatch = computed(() => props.pulse?.upcomingMatches[0])

const outcome = computed(() => {
  if (!recentMatch.value) {
    return
  }
  return getMatchOutcome(recentMatch.value.match, recentMatch.value.team.name)
})

const outcomeBadge = computed(() => {
  if (outcome.value === 'win') {
    return { label: 'Sieg', color: 'success' as const }
  }
  if (outcome.value === 'draw') {
    return { label: 'Remis', color: 'warning' as const }
  }
  if (outcome.value === 'loss') {
    return { label: 'Niederlage', color: 'error' as const }
  }
  return { label: 'Ergebnis', color: 'neutral' as const }
})

const tournamentCountdown = computed(() => {
  if (!props.tournament) {
    return
  }

  const today = new Date(`${getBerlinDateKey()}T12:00:00Z`)
  const eventDate = new Date(`${props.tournament.date}T12:00:00Z`)
  const days = Math.max(0, Math.round((eventDate.getTime() - today.getTime()) / 86_400_000))

  if (days === 0) {
    return 'Heute'
  }
  if (days === 1) {
    return 'Morgen'
  }
  return `In ${days} Tagen`
})

function formatCalendarDate(date: string) {
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}

function formatTournamentRange(tournament: TournamentHighlight) {
  if (!tournament.dateEnd || tournament.dateEnd === tournament.date) {
    return formatCalendarDate(tournament.date)
  }

  return `${formatCalendarDate(tournament.date)} – ${formatCalendarDate(tournament.dateEnd)}`
}

function formatFixture(match: ClubPulseTeamMatch) {
  return `${match.match.home} – ${match.match.away}`
}

function formatTrainingDate(date: string) {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}
</script>

<template>
  <section
    class="club-pulse relative isolate min-h-116 overflow-hidden rounded-2xl border border-default bg-default/90 p-5 shadow-2xl shadow-primary-950/10 sm:p-7"
    aria-labelledby="club-pulse-title"
  >
    <div class="pulse-grid absolute inset-0 -z-20" aria-hidden="true" />
    <div class="pulse-glow absolute -right-32 -top-40 -z-10 size-96 rounded-full" aria-hidden="true" />

    <header class="flex items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="pulse-dot relative flex size-2.5 rounded-full bg-primary" aria-hidden="true" />
          <p id="club-pulse-title" class="text-sm font-semibold tracking-wide text-highlighted">
            Club-Pulse
          </p>
        </div>
        <p class="mt-1 text-sm text-muted">
          Aktuell aus dem Vereinsleben
        </p>
      </div>

      <UIcon
        :name="refreshing ? 'i-ph-circle-notch' : 'i-ph-lightning-duotone'"
        class="size-5 text-primary"
        :class="{ 'animate-spin': refreshing }"
        aria-hidden="true"
      />
    </header>

    <NuxtLink
      v-if="tournament"
      :to="tournament.path"
      class="group mt-8 block rounded-xl border border-primary/20 bg-primary/8 p-5 transition hover:border-primary/40 hover:bg-primary/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase tracking-widest text-primary">Nächstes Highlight</span>
        <UBadge color="primary" variant="subtle">
          {{ tournamentCountdown }}
        </UBadge>
      </div>
      <h2 class="mt-5 max-w-md text-2xl font-bold text-highlighted sm:text-3xl">
        {{ tournament.title }}
      </h2>
      <p class="mt-2 text-sm font-medium text-primary">
        {{ formatTournamentRange(tournament) }}
      </p>
      <p v-if="tournament.description" class="mt-3 line-clamp-2 max-w-lg text-sm leading-6 text-muted">
        {{ tournament.description }}
      </p>
      <span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-highlighted">
        Mehr erfahren
        <UIcon name="i-ph-arrow-right" class="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </NuxtLink>

    <NuxtLink
      v-else-if="upcomingMatch"
      :to="upcomingMatch.team.path"
      class="group mt-8 block rounded-xl border border-primary/20 bg-primary/8 p-5 transition hover:border-primary/40 hover:bg-primary/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase tracking-widest text-primary">Nächster Mannschaftskampf</span>
        <UBadge color="primary" variant="subtle">
          {{ formatLeagueDate(upcomingMatch.match.date) }}
        </UBadge>
      </div>
      <h2 class="mt-5 text-xl font-bold text-highlighted">
        {{ upcomingMatch.team.title }}
      </h2>
      <p class="mt-2 text-sm leading-6 text-muted">
        {{ formatFixture(upcomingMatch) }}
      </p>
      <span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-highlighted">
        Zur Mannschaft
        <UIcon name="i-ph-arrow-right" class="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </NuxtLink>

    <div v-else class="mt-8 rounded-xl border border-primary/20 bg-primary/8 p-5">
      <span class="text-xs font-semibold uppercase tracking-widest text-primary">Nächster Trainingsabend</span>
      <h2 class="mt-5 text-2xl font-bold text-highlighted sm:text-3xl">
        {{ training ? formatTrainingDate(training.date) : 'Freitag ist Schachabend.' }}
      </h2>
      <p class="mt-3 max-w-lg text-sm leading-6 text-muted">
        Kinder und Jugendliche starten um {{ training?.youthTime || '18:00' }} Uhr, Erwachsene um {{ training?.adultTime || '20:15' }} Uhr. Zum Kennenlernen kannst du einfach vorbeikommen.
      </p>
      <p v-if="training?.notice" class="mt-3 text-sm font-medium text-primary">
        {{ training.notice }}
      </p>
      <UButton to="/#training" color="neutral" variant="link" trailing-icon="i-ph-arrow-right" class="mt-4 px-0">
        Termine & Trainingszeiten
      </UButton>
    </div>

    <div class="mt-4 grid gap-4 sm:grid-cols-2">
      <NuxtLink
        to="/#training"
        class="group rounded-xl border border-default bg-elevated/70 p-4 transition hover:border-primary/30 hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <UIcon name="i-ph-clock-duotone" class="size-4 text-primary" aria-hidden="true" />
          Nächstes Training
        </div>
        <p class="mt-3 font-semibold text-highlighted">
          {{ training ? formatTrainingDate(training.date) : 'Freitag' }}
        </p>
        <p class="mt-1 text-sm text-muted">
          {{ training?.youthTime || '18:00' }} / {{ training?.adultTime || '20:15' }} Uhr
        </p>
        <p v-if="training?.notice" class="mt-2 text-xs font-medium text-primary">
          {{ training.notice }}
        </p>
      </NuxtLink>

      <NuxtLink
        v-if="recentMatch"
        :to="recentMatch.team.path"
        class="group rounded-xl border border-default bg-elevated/70 p-4 transition hover:border-primary/30 hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <UIcon name="i-ph-chart-line-up-duotone" class="size-4 text-primary" aria-hidden="true" />
            Letztes Ergebnis
          </span>
          <UBadge :color="outcomeBadge.color" variant="subtle" size="sm">
            {{ outcomeBadge.label }}
          </UBadge>
        </div>
        <p class="mt-3 truncate text-sm font-semibold text-highlighted">
          {{ recentMatch.team.title }}
        </p>
        <div class="mt-1 flex items-baseline justify-between gap-3 text-sm text-muted">
          <span class="truncate">{{ formatFixture(recentMatch) }}</span>
          <strong class="shrink-0 text-highlighted">{{ recentMatch.match.result }}</strong>
        </div>
      </NuxtLink>

      <NuxtLink
        v-else
        to="/mannschaften"
        class="group rounded-xl border border-default bg-elevated/70 p-4 transition hover:border-primary/30 hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <UIcon name="i-ph-users-three-duotone" class="size-4 text-primary" aria-hidden="true" />
          Mannschaften
        </div>
        <p class="mt-3 font-semibold text-highlighted">
          {{ pulse?.configuredTeams || 6 }} Teams im Spielbetrieb
        </p>
        <p class="mt-1 text-sm text-muted">
          Erwachsene und Jugend
        </p>
      </NuxtLink>
    </div>

    <footer class="mt-5 border-t border-default pt-4 text-xs text-dimmed">
      Ergebnisse aus nuLiga
    </footer>
  </section>
</template>

<style scoped>
.club-pulse {
  background-image:
    linear-gradient(145deg, color-mix(in oklab, var(--ui-bg) 96%, var(--ui-primary) 4%), var(--ui-bg));
}

.pulse-grid {
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--ui-primary) 9%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--ui-primary) 9%, transparent) 1px, transparent 1px);
  background-size: 3.5rem 3.5rem;
  mask-image: linear-gradient(to bottom left, black, transparent 78%);
}

.pulse-glow {
  background: radial-gradient(circle, color-mix(in oklab, var(--ui-primary) 22%, transparent), transparent 66%);
  animation: pulse-drift 10s ease-in-out infinite alternate;
}

.pulse-dot::after {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: inherit;
  content: '';
  animation: pulse-ring 2.4s ease-out infinite;
}

@keyframes pulse-drift {
  to { transform: translate(-2rem, 2.5rem) scale(1.1); }
}

@keyframes pulse-ring {
  70%, 100% { opacity: 0; transform: scale(2.4); }
}

@media (prefers-reduced-motion: reduce) {
  .pulse-glow,
  .pulse-dot::after {
    animation: none;
  }
}
</style>
