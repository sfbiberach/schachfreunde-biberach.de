<script setup lang="ts">
import type { Tournament } from '~/types'

definePageMeta({
  heroBackground: 'opacity-50',
})
const route = useRoute()

const { data: tournament } = await useAsyncData(route.path, () => queryContent<Tournament>(route.path).findOne())
if (!tournament.value) {
  throw createError({ statusCode: 404, statusMessage: 'Turnier nicht gefunden', fatal: true })
}

const links = computed(() => {
  return [
    {
      label: `Visit ${tournament.value?.title}`,
      color: 'black' as const,
      size: 'md' as const,
      icon: 'i-ph-arrow-square-out',
      trailing: true,
      to: tournament.value?.link,
      target: '_blank',
    },
  ].filter(link => link.to)
})

const title = tournament.value.head?.title || tournament.value.title
const description = tournament.value.head?.description || tournament.value.description
useSeoMeta({
  title,
  description,
})
</script>

<template>
  <UMain>
    <UContainer>
      <UPageHeader :description="tournament?.description" :links="links" headline="Turniere">
        <template #title>
          <div class="flex items-center gap-4">
            <span>{{ tournament?.title }}</span>
          </div>
        </template>

        <div class="absolute top-[68px] -left-[64px] hidden lg:flex">
          <UTooltip text="Zurück zu den Turnieren">
            <UButton
              to="/turniere"
              icon="i-ph-caret-left"
              color="gray"
              :ui="{ rounded: 'rounded-full' }"
              size="lg"
              class=""
            />
          </UTooltip>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-center gap-3 mt-4">
          <div v-if="tournament?.date" class="flex items-center gap-1.5">
            <UIcon name="i-ph-calendar" class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">{{ getTournamentDate(tournament) }}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <UIcon name="i-ph-map-pin" class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">{{ tournament?.location }}</span>
          </div>

          <span v-if="tournament?.x" class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>
          <NuxtLink v-if="tournament?.x" :to="`https://x.com/${tournament.x}`" target="_blank" class="flex items-center gap-1.5 hover:text-primary">
            <UIcon name="i-simple-icons-x" class="w-5 h-5" />
            <span class="text-sm font-medium">{{ tournament.x }}</span>
          </NuxtLink>

          <span v-if="tournament?.instagram" class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>
          <NuxtLink v-if="tournament?.instagram" :to="`https://instagram.com/${tournament?.instagram}`" target="_blank" class="flex items-center gap-1.5 hover:text-primary">
            <UIcon name="i-simple-icons-instagram" class="w-5 h-5" />
            <span class="text-sm font-medium">{{ tournament.instagram }}</span>
          </NuxtLink>

          <span v-if="tournament?.link" class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>
          <NuxtLink v-if="tournament?.link" :to="tournament.link" target="_blank" class="flex items-center gap-1.5 hover:text-primary">
            <UIcon name="i-ph-link" class="w-5 h-5" />
            <span class="text-sm font-medium">Website</span>
          </NuxtLink>
        </div>
      </UPageHeader>

      <UPage :ui="{ right: 'my-8' }">
        <UPageBody prose class="prose-lg dark:text-gray-300">
          <ContentRenderer v-if="tournament?.body?.children?.length" :value="tournament" />
        </UPageBody>

        <template #right>
          <div v-if="tournament?.resources?.length">
            <UDivider type="dashed" class="my-6" />

            <UPageLinks title="Resources" :links="tournament?.resources" />
          </div>
        </template>
      </UPage>
    </UContainer>
  </UMain>
</template>
