<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-50',
})

const { data: page } = await usePageContent({
  collection: 'tournament',
})

const route = useRoute()

const tournamentSlug = computed(() => {
  const param = route.params.slug
  if (Array.isArray(param)) {
    return param[0]
  }
  return param
})
</script>

<template>
  <NuxtLayout name="event" collection="tournament">
    <ContentRenderer v-if="page" :value="page" />

    <section class="mt-12 space-y-6">
      <ProseH2>
        Turnierberichte
      </ProseH2>

      <HArticleGrid
        status="published"
        :where="[{ field: 'tournament', operator: '=', value: tournamentSlug }]"
        :sort="{ field: 'date', direction: 'DESC' }"
      />
    </section>
  </NuxtLayout>
</template>
