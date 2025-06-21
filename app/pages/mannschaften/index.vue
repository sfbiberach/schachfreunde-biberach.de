<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70',
})

const { data: teams } = await useTeams()
</script>

<template>
  <NuxtLayout name="content">
    <UPageGrid class="mt-8">
      <UPageCard
        v-for="(team, index) in teams"
        :key="index"
        :to="team.path"
        :title="team.title"
        :description="team.description"
        :ui="{
          title: 'text-lg',
          description: 'line-clamp-3',
        }"
      />
    </UPageGrid>
  </NuxtLayout>
</template>
