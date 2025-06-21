<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-50',
})

const route = useRoute()

const { data: team } = await useTeam(route.path)
if (!team.value) {
  throw createError({ statusCode: 404, statusMessage: 'Mannschaft nicht gefunden', fatal: true })
}

const links = computed(() => {
  return [
    {
      label: `Visit ${team.value?.title}`,
      color: 'black' as const,
      size: 'md' as const,
      icon: 'i-ph-arrow-square-out',
      trailing: true,
      to: team.value?.link,
      target: '_blank',
    },
  ].filter(link => link.to)
})

const title = team.value.head?.title || team.value.title
const description = team.value.head?.description || team.value.description
useSeoMeta({
  title,
  description,
})
</script>

<template>
  <UMain>
    <UContainer>
      <UPageHeader :description="team?.description" :links headline="Mannschaften">
        <template #title>
          <div class="flex items-center gap-4">
            <span>{{ team?.title }}</span>
          </div>
        </template>

        <div class="absolute top-[68px] -left-[64px] hidden lg:flex">
          <UTooltip text="Zurück zu den Mannschaften">
            <UButton
              to="/mannschaften"
              icon="i-ph-caret-left"
              color="gray"
              :ui="{ rounded: 'rounded-full' }"
              size="lg"
              class=""
            />
          </UTooltip>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-center gap-3 mt-4">
          <div class="flex items-center gap-1.5">
            <UIcon name="i-ph-map-pin" class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm font-medium">{{ team?.location }}</span>
          </div>

          <span v-if="team?.x" class="hidden lg:block text-gray-500 dark:text-gray-400">&bull;</span>
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
          </NuxtLink>
        </div>
      </UPageHeader>

      <UPage :ui="{ right: 'my-8' }">
        <UPageBody prose class="prose-lg dark:text-gray-300">
          <ContentRenderer v-if="team?.body?.children?.length" :value="team" />
        </UPageBody>

        <template #right>
          <div v-if="team?.resources?.length">
            <UDivider type="dashed" class="my-6" />

            <UPageLinks title="Resources" :links="team?.resources" />
          </div>
        </template>
      </UPage>
    </UContainer>
  </UMain>
</template>
