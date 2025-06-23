<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-50',
})

const route = useRoute()
const appConfig = useAppConfig()

const { data: team } = await useTeam(route.path)
if (!team.value) {
  throw createError({ statusCode: 404, statusMessage: 'Mannschaft nicht gefunden', fatal: true })
}
</script>

<template>
  <NuxtLayout
    name="article" :breadcrumbs="[
      { label: 'Teams', to: '/mannschaften', icon: appConfig.app.icons.team },
      { label: team?.title, to: team?.path },
    ]"
  >
    <ContentRenderer v-if="team?.body" :value="team" />

    <template #header>
      <div class="mt-4 flex flex-wrap items-center gap-6">
        <UButton
          v-for="link in team?.links"
          :key="link.label"
          v-bind="link"
        >
          {{ link.label }}
        </UButton>

        <!-- <div class="flex items-center gap-1.5">
          <UIcon name="i-ph-map-pin" class="w-5 h-5 flex-shrink-0" />
          <span class="text-sm font-medium">{{ team?.location }}</span>
        </div> -->

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
