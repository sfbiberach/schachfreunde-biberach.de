<script setup lang="ts">
const { data: page } = await useAsyncData('landing', () => queryCollection('landing').path('/').first())

definePageMeta({
  heroBackground: 'opacity-80',
})

const images = [
  { class: 'col-span-3 col-start-2 row-start-2', src: '/assets/home/landing-section-1.jpg' },
  { class: 'col-span-3 col-start-3 row-start-1', src: '/assets/home/landing-section-2.jpg' },
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

      <UPageGrid class="hidden lg:grid gap-8 auto-rows-fr lg:max-h-120 overflow-hidden lg:grid-cols-(--grid-cols-landing) xl:grid-cols-(--grid-cols-landing-padded)">
        <template v-for="(image, index) in images" :key="index">
          <NuxtImg
            v-if="image.src"
            v-bind="image"
            class="w-full h-full max-w-md mx-auto rounded-md shadow-xl ring ring-default object-cover"
          />
          <div
            v-else
            v-bind="image"
            class="w-full h-full max-w-md mx-auto rounded-md shadow-xl ring ring-default"
          />
        </template>
      </UPageGrid>
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
          Falls Du uns näher kennenlernen möchtest, kannst Du entweder in unserem Spiellokal vorbeischauen (wie oben beschrieben) oder uns per Mail/WhatsApp kontaktieren. Suche Dir dazu die
          <ProseA to="/impressum">
            Kontaktdaten
          </ProseA>
          eines geeigneten Ansprechpartners und schreibe uns eine Nachricht. Wir freuen uns!
        </template>
        <img
          src="/assets/home/contact-us.jpg"
          class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
        >
      </UPageCTA>
    </UPageSection>
  </NuxtLayout>
</template>
