<script setup lang="ts">
import type { BadgeProps } from '#ui/types'

definePageMeta({
  heroBackground: 'opacity-50',
})

const route = useRoute()
const appConfig = useAppConfig()

const tournamentSlug = computed(() => {
  const param = route.params.slug
  if (Array.isArray(param)) {
    return param[0]
  }
  return param
})

const categoriesMap = appConfig.app.blog?.categories as Record<string, BadgeProps> | undefined

const { data: tournament } = await useTournament(route.path)
if (!tournament.value) {
  throw createError({ statusCode: 404, statusMessage: 'Turnier nicht gefunden', fatal: true })
}

const { data: articles } = await useAsyncData(
  () => `tournament-articles:${tournamentSlug.value ?? ''}`,
  async () => {
    if (!tournamentSlug.value) {
      return []
    }
    const items = await queryCollection('blog')
      .where('status', '=', 'published')
      .where('tournament', '=', tournamentSlug.value)
      .order('date', 'DESC')
      .all()
    await resolveBlogAuthors(items)
    resolveBlogBadge(items, categoriesMap)
    return items
  },
  { watch: [tournamentSlug] },
)

const tournamentArticles = computed(() =>
  Array.isArray(articles.value) ? articles.value : [],
)
</script>

<template>
  <NuxtLayout
    name="article" :breadcrumbs="[
      { label: 'Turniere', to: '/turniere', icon: appConfig.app.icons.tournament },
      { label: tournament?.title, to: tournament?.path },
    ]"
  >
    <ContentRenderer v-if="tournament?.body" :value="tournament" />

    <section v-if="tournamentArticles.length" class="mt-12 space-y-6">
      <ProseH2>
        Turnierberichte
      </ProseH2>
      <UBlogPosts>
        <UBlogPost
          v-for="article in tournamentArticles"
          :key="article.id ?? article.path"
          :to="article.path"
          :title="article.title"
          :description="article.description"
          :date="formatDate(article.date)"
          :badge="article.resolvedBadge"
          :authors="(article.resolvedAuthors || []).map(author => ({ ...author, target: '_blank' }))"
          variant="subtle"
          :ui="{ title: 'post-title line-clamp-2 whitespace-normal', description: 'post-description line-clamp-3' }"
        >
          <template #date>
            <time v-if="article.date" :datetime="new Date(article.date).toISOString()" class="text-sm text-gray-500 dark:text-gray-400 font-medium pointer-events-none">
              {{ new Date(article.date).toLocaleDateString('de', { year: 'numeric', month: 'short', day: 'numeric' }) }}
            </time>
          </template>
        </UBlogPost>
      </UBlogPosts>
    </section>

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
      </div>
    </template>
  </NuxtLayout>
</template>
