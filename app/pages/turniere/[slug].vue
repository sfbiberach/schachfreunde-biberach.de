<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-50',
})

const route = useRoute()
const appConfig = useAppConfig()

const { data: tournament } = await useTournament(route.path)
if (!tournament.value) {
  throw createError({ statusCode: 404, statusMessage: 'Turnier nicht gefunden', fatal: true })
}
</script>

<template>
  <NuxtLayout
    name="article" :breadcrumbs="[
      { label: 'Turniere', to: '/turniere', icon: appConfig.app.icons.tournament },
      { label: tournament?.title, to: tournament?.path },
    ]"
  >
    <ContentRenderer v-if="tournament?.body" :value="tournament" />

    <template #header>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <UButton v-if="tournament?.location" icon="i-ph-map-pin" variant="ghost" color="neutral">
          {{ tournament?.location }}
        </UButton>

        <span v-if="tournament?.links?.length" class="hidden lg:block text-muted">&bull;</span>

        <template
          v-for="(link, index) in tournament?.links"
          :key="link.label"
        >
          <UButton
            v-bind="link"
          >
            {{ link.label }}
          </UButton>

          <span v-if="index < (tournament?.links?.length ?? 0)" class="hidden lg:block text-muted">&bull;</span>
        </template>

        <!-- <span v-if="team?.x" class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>
        <NuxtLink v-if="team?.x" :to="`https://x.com/${team.x}`" target="_blank" class="flex items-center gap-1.5 hover:text-primary">
          <UIcon name="i-simple-icons-x" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ team.x }}</span>
        </NuxtLink>

        <span v-if="team?.instagram" class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>
        <NuxtLink v-if="team?.instagram" :to="`https://instagram.com/${team?.instagram}`" target="_blank" class="flex items-center gap-1.5 hover:text-primary">
          <UIcon name="i-simple-icons-instagram" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ team.instagram }}</span>
        </NuxtLink>

        <span v-if="team?.link" class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>
        <NuxtLink v-if="team?.link" :to="team.link" target="_blank" class="flex items-center gap-1.5 hover:text-primary">
          <UIcon name="i-ph-link" class="w-5 h-5" />
          <span class="text-sm font-medium">Website</span>
        </NuxtLink> -->
      </div>
    </template>
  </NuxtLayout>
</template>
