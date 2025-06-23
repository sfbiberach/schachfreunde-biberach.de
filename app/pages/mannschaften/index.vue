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
        v-bind="team"
        :to="team.path"
        :spotlight="true"
        :ui="{
          title: 'text-lg',
          description: 'line-clamp-3',
        }"
      />
    </UPageGrid>
  </NuxtLayout>
</template>
