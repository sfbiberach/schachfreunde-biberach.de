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

const calendarDateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const trainingDateFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

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
  return calendarDateFormatter.format(new Date(`${date}T12:00:00Z`))
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
  return trainingDateFormatter.format(new Date(`${date}T12:00:00Z`))
}
</script>

<template>
  <section
    class="club-pulse relative isolate min-h-116 overflow-hidden rounded-2xl border border-default p-5 shadow-2xl shadow-primary-950/10 sm:p-7"
    aria-labelledby="club-pulse-title"
  >
    <div class="pulse-glow absolute -right-56 -top-64 -z-10 size-[38rem] rounded-full" aria-hidden="true" />
    <div class="pulse-sheen absolute inset-x-0 top-0 -z-10 h-px" aria-hidden="true" />
    <div class="pulse-corner-light" aria-hidden="true" />

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

      <span class="pulse-status-icon relative isolate flex size-10 shrink-0 items-center justify-center rounded-full" aria-hidden="true">
        <UIcon
          :name="refreshing ? 'i-ph-circle-notch' : 'i-ph-lightning-duotone'"
          class="pulse-status-glyph size-5 text-primary"
          :class="{ 'animate-spin': refreshing }"
        />
      </span>
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
    linear-gradient(
      145deg,
      color-mix(in oklab, var(--ui-bg) 91%, var(--ui-primary) 9%) 0%,
      color-mix(in oklab, var(--ui-bg) 97%, var(--ui-primary) 3%) 38%,
      var(--ui-bg) 76%
    );
}

.pulse-glow {
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--ui-primary) 18%, transparent) 0%,
    color-mix(in oklab, var(--ui-primary) 11%, transparent) 28%,
    color-mix(in oklab, var(--ui-primary) 5%, transparent) 52%,
    color-mix(in oklab, var(--ui-primary) 1.5%, transparent) 74%,
    transparent 100%
  );
  filter: blur(18px);
  opacity: 0.82;
  animation: pulse-drift 12s ease-in-out infinite alternate;
}

.pulse-sheen {
  background: linear-gradient(
    90deg,
    transparent 8%,
    color-mix(in oklab, var(--ui-primary) 30%, transparent) 70%,
    transparent 100%
  );
  opacity: 0.7;
}

.pulse-corner-light {
  position: absolute;
  top: -1px;
  right: -1px;
  z-index: -1;
  width: 48%;
  height: 44%;
  overflow: hidden;
  border-top-right-radius: inherit;
  background: radial-gradient(
    ellipse at 100% 0%,
    color-mix(in oklab, var(--ui-primary) 13%, transparent) 0%,
    color-mix(in oklab, var(--ui-primary) 6%, transparent) 34%,
    transparent 72%
  );
  pointer-events: none;
}

.pulse-corner-light::before,
.pulse-corner-light::after {
  position: absolute;
  top: 0;
  right: 0;
  background: color-mix(in oklab, var(--ui-primary) 58%, white 8%);
  content: '';
  filter: drop-shadow(0 0 0.35rem color-mix(in oklab, var(--ui-primary) 32%, transparent));
}

.pulse-corner-light::before {
  width: 100%;
  height: 1px;
  mask-image: linear-gradient(to left, black 0%, rgb(0 0 0 / 78%) 38%, transparent 100%);
}

.pulse-corner-light::after {
  width: 1px;
  height: 100%;
  mask-image: linear-gradient(to bottom, black 0%, rgb(0 0 0 / 72%) 42%, transparent 100%);
}

.pulse-status-icon {
  border: 1px solid transparent;
  background:
    linear-gradient(
      145deg,
      color-mix(in oklab, var(--ui-primary) 18%, var(--ui-bg)),
      color-mix(in oklab, var(--ui-primary) 7%, var(--ui-bg))
    ) padding-box,
    linear-gradient(
      145deg,
      color-mix(in oklab, var(--ui-primary) 78%, white) 0%,
      color-mix(in oklab, var(--ui-primary) 36%, transparent) 48%,
      color-mix(in oklab, black 54%, transparent) 100%
    ) border-box;
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 18%, transparent),
    inset 0 -0.2rem 0.5rem color-mix(in oklab, black 9%, transparent),
    0 0 0 1px color-mix(in oklab, var(--ui-primary) 10%, transparent),
    0 0.18rem 0.42rem color-mix(in oklab, black 16%, transparent),
    0 0 0.7rem color-mix(in oklab, var(--ui-primary) 9%, transparent);
}

.pulse-status-icon::before {
  position: absolute;
  inset: -0.3rem;
  z-index: -1;
  border: 1px solid color-mix(in oklab, var(--ui-primary) 14%, transparent);
  border-radius: inherit;
  content: '';
}

.pulse-status-glyph {
  filter: drop-shadow(0 0 0.18rem color-mix(in oklab, var(--ui-primary) 26%, transparent));
}

:global(.light .pulse-status-icon) {
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 28%, transparent),
    inset 0 -0.14rem 0.34rem color-mix(in oklab, black 3%, transparent),
    0 0 0 1px color-mix(in oklab, var(--ui-primary) 7%, transparent),
    0 0.08rem 0.22rem color-mix(in oklab, black 4%, transparent),
    0 0 0.38rem color-mix(in oklab, var(--ui-primary) 4%, transparent);
}

:global(.light .pulse-status-glyph) {
  filter: none;
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
  to { transform: translate(-1.25rem, 1.5rem) scale(1.04); }
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
