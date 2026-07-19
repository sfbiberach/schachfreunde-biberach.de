<script setup lang="ts">
import type { PageSectionProps } from '@nuxt/ui'
import type { ClubPulseResponse } from '~~/shared/types/clubPulse'
import type { TrainingSchedule } from '~~/shared/types/training'

const today = getBerlinDateKey()
const contentDateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const { data: page } = await useAsyncData('landing', () => queryCollection('landing').path('/').first())
// Nuxt Content's inherited component schema is structurally compatible, but its
// generated nested component props are deliberately broader than Nuxt UI's types.
const heroProps = computed(() => page.value?.hero as PageSectionProps | undefined)
const { data: currentContent } = await useAsyncData('landing-current-content', async () => {
  const [tournaments, articles, galleryArticles] = await Promise.all([
    queryCollection('tournament')
      .where('status', '=', 'published')
      .select('title', 'description', 'path', 'date', 'dateEnd')
      .all(),
    queryCollection('article')
      .where('status', '=', 'published')
      .order('date', 'DESC')
      .select('title', 'description', 'path', 'date', 'category', 'image')
      .limit(8)
      .all(),
    queryCollection('article')
      .where('status', '=', 'published')
      .where('image', 'IS NOT NULL')
      .order('date', 'DESC')
      .select('title', 'path', 'date', 'category', 'image')
      .limit(3)
      .all(),
  ])

  return {
    tournaments,
    articles,
    galleryArticles,
  }
})

const {
  data: pulse,
  status: pulseStatus,
  refresh: refreshPulse,
} = await useFetch<ClubPulseResponse>('/api/club-pulse', {
  key: 'club-pulse',
  deep: false,
})

const nextTournament = computed(() => currentContent.value?.tournaments
  .filter(tournament =>
    typeof tournament.date === 'string'
    && String(tournament.dateEnd || tournament.date) >= today,
  )
  .sort((a, b) => String(a.date).localeCompare(String(b.date)))[0])

const tournamentHighlight = computed(() => {
  const tournament = nextTournament.value
  if (!tournament || typeof tournament.date !== 'string') {
    return null
  }

  return {
    title: tournament.title,
    description: tournament.description,
    date: tournament.date,
    dateEnd: typeof tournament.dateEnd === 'string' ? tournament.dateEnd : undefined,
    path: tournament.path,
  }
})

const nextTraining = computed(() => page.value?.training
  ? getNextTraining(page.value.training as TrainingSchedule)
  : null)

const activityCards = computed(() => {
  const featuredPath = tournamentHighlight.value?.path
  const curated = (page.value?.highlights || [])
    .filter(highlight =>
      (!highlight.visibleFrom || highlight.visibleFrom <= today)
      && (!highlight.visibleUntil || highlight.visibleUntil >= today)
      && highlight.to !== featuredPath,
    )
    .map(highlight => ({
      ...highlight,
      kind: 'highlight' as const,
      meta: 'Im Fokus',
    }))

  const curatedPaths = new Set(curated.map(card => card.to))
  const articles = (currentContent.value?.articles || [])
    .filter(article =>
      article.path !== featuredPath
      && !curatedPaths.has(article.path),
    )
    .map(article => ({
      title: article.title,
      description: article.description,
      to: article.path,
      icon: 'i-ph-newspaper-duotone',
      kind: 'article' as const,
      meta: formatContentDate(article.date),
    }))

  return [...curated, ...articles].slice(0, 4)
})

const galleryImages = computed(() => {
  const candidates = currentContent.value?.galleryArticles || []

  if (candidates.length === 0) {
    return []
  }

  const candidatesWithDimensions = candidates.filter(article => article.image?.width && article.image.height)
  const lead = candidatesWithDimensions.length > 0
    ? candidatesWithDimensions.reduce((best, article) => {
        const image = article.image!
        const bestImage = best.image!

        return image.width! * image.height! > bestImage.width! * bestImage.height!
          ? article
          : best
      })
    : candidates[1] || candidates[0]!

  return [lead, ...candidates.filter(article => article.path !== lead.path)]
    .map(article => ({
      src: article.image!.src,
      alt: article.image!.alt,
      width: article.image!.width,
      height: article.image!.height,
      position: article.image!.position,
      eyebrow: [article.category, formatContentDate(article.date)].filter(Boolean).join(' · '),
      caption: article.title,
      to: article.path,
    }))
})

const pulseRefreshing = computed(() => pulseStatus.value === 'pending')

const calendarBase = 'https://calendar.google.com/calendar/embed?src=sf.hnbiberach%40gmail.com&mode=AGENDA&showTitle=0&showDate=0&showNav=0&showPrint=0&showTabs=0&showCalendars=0'
const calendarBuster = ref('')
const calendarSrc = computed(() => calendarBuster.value
  ? `${calendarBase}&cachebust=${encodeURIComponent(calendarBuster.value)}`
  : calendarBase)

onMounted(() => {
  calendarBuster.value = new Date().toISOString()
  void refreshPulse()
})

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
  ogTitle: page.value?.title,
  ogDescription: page.value?.description,
})

definePageMeta({
  heroBackground: 'opacity-60',
})

function formatContentDate(date?: string | Date) {
  if (!date) {
    return ''
  }
  const value = date instanceof Date ? date : new Date(`${date}T12:00:00Z`)

  return contentDateFormatter.format(value)
}
</script>

<template>
  <NuxtLayout v-if="page">
    <UPageSection v-bind="heroProps" class="relative overflow-hidden">
      <template #title>
        <span v-html="page.hero?.title" />
      </template>
      <template #description>
        <span v-html="page.hero?.description" />
      </template>

      <ClubPulse
        :pulse="pulse"
        :tournament="tournamentHighlight"
        :training="nextTraining"
        :refreshing="pulseRefreshing"
      />
      <Chessboard class="-z-10" />
    </UPageSection>

    <UPageSection
      id="vereinsleben"
      :ui="{ container: 'pt-0! pb-12 sm:pb-16 lg:pb-20' }"
    >
      <UPageGrid class="lg:grid-cols-2! xl:grid-cols-4!">
        <UPageCard
          v-for="card in activityCards"
          :key="card.to"
          :title="card.title"
          :description="card.description"
          :to="card.to"
          :icon="card.icon"
          spotlight
          class="transition-transform duration-300 motion-safe:hover:-translate-y-1"
        >
          <template #header>
            <span
              class="text-xs font-semibold uppercase tracking-widest"
              :class="card.kind === 'highlight' ? 'text-primary' : 'text-muted'"
            >
              {{ card.meta }}
            </span>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <UPageSection
      id="training"
      title="Training & Termine"
      orientation="horizontal"
      class="training-section"
      :ui="{
        container: 'py-16 sm:py-20 lg:py-24 gap-10 sm:gap-12',
      }"
    >
      <template #description>
        <div class="prose prose-primary dark:prose-invert text-lg">
          <Snippet path="/snippets/training" />
        </div>
      </template>

      <iframe
        title="Vereinskalender der Schachfreunde Heilbronn-Biberach"
        class="min-h-112 w-full rounded-xl border-0 bg-transparent"
        scrolling="yes"
        loading="lazy"
        :src="calendarSrc"
      />
    </UPageSection>

    <USeparator />

    <UPageSection
      v-if="page.gallery && galleryImages.length"
      :title="page.gallery.title"
      :description="page.gallery.description"
      :ui="{
        container: 'py-16 sm:py-20 lg:py-24 gap-10 sm:gap-12',
      }"
    >
      <CommunityGallery :images="galleryImages" />
    </UPageSection>

    <UPageSection
      class="cta-section border-y border-default"
      :ui="{
        container: 'relative z-10 py-16 sm:py-20 lg:py-24',
      }"
    >
      <template #top>
        <LazyCtaBackdrop :hydrate-on-visible="{ rootMargin: '240px' }" />
      </template>

      <UPageCTA
        title="Lust auf eine Partie?"
        description="Schau freitags unverbindlich vorbei oder melde dich bei uns. Wir helfen dir, die passende Trainingsgruppe oder Ansprechperson zu finden."
        orientation="horizontal"
        variant="naked"
        class="rounded-none overflow-visible"
        :ui="{
          container: 'px-0 py-0 sm:px-0 sm:py-0 lg:px-0 lg:py-0 gap-10 sm:gap-12 lg:gap-16',
          title: 'text-3xl sm:text-4xl lg:text-5xl',
        }"
        :links="[
          {
            label: 'Kontakt aufnehmen',
            to: '/impressum',
            icon: 'i-ph-chat-circle-dots-duotone',
          },
          {
            label: 'Verein kennenlernen',
            to: '/blog',
            color: 'neutral',
            variant: 'outline',
            trailingIcon: 'i-ph-arrow-right',
          },
        ]"
      >
        <NuxtImg
          src="/assets/home/contact-us.jpg"
          alt="Zwei Vereinsmitglieder bei einer Schachpartie."
          width="1200"
          height="800"
          sizes="100vw lg:45vw"
          loading="lazy"
          class="w-full rounded-xl object-cover shadow-2xl ring-1 ring-white/15"
        />
      </UPageCTA>
    </UPageSection>
  </NuxtLayout>
</template>

<style scoped>
.cta-section {
  background-color: var(--ui-bg-elevated);
}

.training-section {
  background-color: color-mix(in oklab, var(--ui-primary) 4%, var(--ui-bg));
}

:global(.dark .training-section) {
  background-color: color-mix(in oklab, var(--ui-bg-elevated) 35%, var(--ui-bg));
}
</style>
