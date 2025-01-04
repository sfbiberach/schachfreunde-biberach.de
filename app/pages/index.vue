<script setup lang="ts">
const { data: page } = await useAsyncData('/', () => queryContent('/').findOne())

definePageMeta({
  heroBackground: 'opacity-80',
})

useSeoMeta({
  titleTemplate: page.value?.titleTemplate,
  title: page.value?.title,
})

const images = [
  { class: 'h-8' },
  { src: '/assets/home/1690827815.jpg' },
  { src: '/assets/blog/20180704.bw-mannschaftsfinale-u16/1561.jpg' },
]
</script>

<template>
  <NuxtLayout v-if="page">
    <ULandingSection v-bind="page.hero" class="relative">
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

      <ClientOnly>
        <Chessboard class="z-[-1]" />
      </ClientOnly>
    </ULandingSection>

    <ULandingSection :ui="{ wrapper: '!pt-0 py-12 sm:py-16' }">
      <UPageGrid v-if="page.cards">
        <ULandingCard v-for="(card, index) in page.cards" :key="index" v-bind="card" />
      </UPageGrid>
    </ULandingSection>

    <ULandingSection
      id="training"
      title="Termine & Trainingszeiten"
      align="right"
    >
      <template #description>
        <div class="prose prose-primary dark:prose-invert text-lg">
          <h3>Wöchentliches Training</h3>
          <p>Wir treffen uns jeden Freitag um 18:00 Uhr zum Jugendtraining in unserem Spiellokal. Anschließend findet um 20:15 Uhr das Erwachsenentraining statt. Schau doch gerne mal vorbei, eine Voranmeldung ist nicht nötig!</p>
          <h3>Adresse</h3>
          <p>
            Grundschule Biberach<br>
            Bibersteige 9<br>
            74078 Heilbronn-Biberach<br>
            2. Stock, Vereinseingang<br>
            (neben Hallenbad)
          </p>
        </div>
      </template>
      <iframe class="rounded-xl w-full h-full min-h-[384px]" scrolling="yes" src="https://calendar.google.com/calendar/embed?src=sf.hnbiberach%40gmail.com&amp;mode=AGENDA&amp;showTitle=0&amp;showDate=0&amp;showNav=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0" />
    </ULandingSection>

    <ULandingSection>
      <ULandingCTA
        title="Kontaktiere uns"
        align="left"
        :card="false"
      >
        <template #description>
          <p class="prose prose-primary dark:prose-invert text-lg">
            Falls Du uns näher kennenlernen möchtest, kannst Du entweder in unserem Spiellokal vorbeischauen (wie oben beschrieben) oder uns per Mail/WhatsApp kontaktieren. Suche Dir dazu die <NuxtLink to="/impressum">
              Kontaktdaten
            </NuxtLink> eines geeigneten Ansprechpartners und schreibe uns eine Nachricht. Wir freuen uns!
          </p>
        </template>
        <img
          src="https://picsum.photos/640/360"
          class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
        >
      </ULandingCTA>
    </ULandingSection>
  </NuxtLayout>
</template>
