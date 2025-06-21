import { useAsyncData } from '#imports'
import { createSharedComposable } from '@vueuse/core'
import { useBlogList } from '~/composables/useBlogList'
import { useTeams } from '~/composables/useTeams'
import { useTournaments } from '~/composables/useTournaments'

function _useHeaderLinks() {
  const appConfig = useAppConfig()
  const route = useRoute()

  const headerLinks = computed(() =>
    appConfig.app.links.header.map(link => ({
      ...link,
      active: route.path.startsWith(link.to),
    })),
  )
  return { headerLinks }
}

export const useHeaderLinks = import.meta.client ? createSharedComposable(_useHeaderLinks) : _useHeaderLinks

function _useFooterLinks() {
  const appConfig = useAppConfig()
  const route = useRoute()

  const footerLinks = computed(() =>
    appConfig.app.links.footer.map(link => ({
      ...link,
      children: link.children?.map(child => ({
        ...child,
        active: route.path.startsWith(child.to),
      })),
    })),
  )
  return { footerLinks }
}

export const useFooterLinks = import.meta.client ? createSharedComposable(_useFooterLinks) : _useFooterLinks

function _useNavigation() {
  const searchTerm = ref<string>('')

  const { headerLinks } = useHeaderLinks()
  const { footerLinks } = useFooterLinks()

  // Teams
  const { data: teams } = useTeams()

  // Tournaments
  const { tournaments, fetchList: fetchTournaments } = useTournaments()
  fetchTournaments()

  // Blog articles (published)
  const { data: publishedArticles } = useBlogList({ itemsPerPage: 1000 })
  // Blog articles (archived)
  const { data: archivedArticles } = useAsyncData('archived-blogs', async () => {
    // @ts-expect-error Nuxt Content auto-import
    const articles = await queryContent('/blog').where({ status: 'archived', _extension: 'md' }).find()
    return articles
  })

  // Footer links grouped
  const groupedFooterLinks = computed(() =>
    footerLinks.value.map(group => ({
      label: group.label,
      items: group.children?.map(child => ({
        ...child,
        id: `footer-${group.label}-${child.label}`,
      })) || [],
    })),
  )

  // Teams group
  const teamsGroup = computed(() => ({
    label: 'Mannschaften',
    items: teams.value.map(team => ({
      id: `team-${team.title}`,
      label: team.title,
      to: team.external ? team.link : team._path,
      icon: 'i-ph-castle-turret-duotone',
      target: team.external ? '_blank' : undefined,
    })),
  }))

  // Tournaments group
  const tournamentsGroup = computed(() => ({
    label: 'Turniere',
    items: tournaments.value.map(tournament => ({
      id: `tournament-${tournament.title}`,
      label: tournament.title,
      to: tournament.external ? tournament.link : tournament._path,
      icon: 'i-ph-trophy-duotone',
      target: tournament.external ? '_blank' : undefined,
    })),
  }))

  // Blog groups
  const publishedBlogGroup = computed(() => ({
    label: 'Aktuelle Beiträge',
    items: (publishedArticles.value || []).map(article => ({
      id: `blog-${article.title}`,
      label: article.title,
      to: article.path,
      icon: 'i-ph-newspaper-duotone',
      date: article.date,
    })),
  }))
  const archivedBlogGroup = computed(() => ({
    label: 'Archivierte Beiträge',
    items: (archivedArticles.value || []).map((article: any) => ({
      id: `archived-blog-${article.title}`,
      label: article.title,
      to: article.path,
      icon: 'i-ph-archive-duotone',
      date: article.date,
    })),
  }))

  // Compose all groups for search
  const searchGroups = computed(() => [
    ...groupedFooterLinks.value,
    teamsGroup.value,
    tournamentsGroup.value,
    publishedBlogGroup.value,
    archivedBlogGroup.value,
    // Theme group can be added here if needed
  ])

  return {
    searchTerm,
    headerLinks,
    footerLinks,
    searchLinks: searchGroups,
  }
}

export const useNavigation = import.meta.client ? createSharedComposable(_useNavigation) : _useNavigation
