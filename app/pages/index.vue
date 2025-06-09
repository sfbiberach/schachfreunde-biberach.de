<script setup lang="ts">
const { data: page } = await useAsyncData('landing', () => queryCollection('landing').path('/').first())

definePageMeta({
  heroBackground: 'opacity-80',
})

const images = [
  { class: 'h-8' },
  { src: '/assets/home/1690827815.jpg' },
  { src: '/assets/blog/20180704.bw-mannschaftsfinale-u16/1561.jpg' },
]
</script>

<template>
  <NuxtLayout v-if="page">
    <UPageSection v-bind="page.hero" class="relative">
      <template #title>
        <span v-html="page.hero?.title" />
      </template>

      <template #description>
        <span v-html="page.hero?.description" />
      </template>

      <UPageColumns class="hidden lg:block" :style="{ columns: images.length > 1 ? 2 : 1 }">
        <template v-for="(image, _index) in images" :key="_index">
          <NuxtImg v-if="image.src" v-bind="image" class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700" />
          <div v-else v-bind="image" />
        </template>
      </UPageColumns>

      <Chessboard class="z-[-1] chessboard" />
    </UPageSection>

    <UPageSection :ui="{ container: '!pt-0 py-12 sm:py-16' }">
      <UPageGrid v-if="page.cards">
        <UPageCard v-for="(card, index) in page.cards" :key="index" v-bind="card" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="training"
      title="Termine & Trainingszeiten"
      orientation="horizontal"
    >
      <template #description>
        <div class="prose prose-primary dark:prose-invert text-lg">
          <Snippet path="/snippets/training" />
        </div>
      </template>
      <iframe class="rounded-sm w-full h-full min-h-[384px]" scrolling="yes" src="https://calendar.google.com/calendar/embed?src=sf.hnbiberach%40gmail.com&amp;mode=AGENDA&amp;showTitle=0&amp;showDate=0&amp;showNav=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0" />
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Kontaktiere uns"
        orientation="horizontal"
        variant="subtle"
      >
        <template #description>
          <p class="prose prose-primary dark:prose-invert text-lg">
            Falls Du uns näher kennenlernen möchtest, kannst Du entweder in unserem Spiellokal vorbeischauen (wie oben beschrieben) oder uns per Mail/WhatsApp kontaktieren. Suche Dir dazu die
            <NuxtLink to="/impressum">
              Kontaktdaten
            </NuxtLink>
            eines geeigneten Ansprechpartners und schreibe uns eine Nachricht. Wir freuen uns!
          </p>
        </template>
        <img
          src="https://picsum.photos/640/360"
          class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
        >
      </UPageCTA>
    </UPageSection>
  </NuxtLayout>
</template>
