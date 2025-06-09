import { createSharedComposable } from '@vueuse/core'

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
  // const nuxtApp = useNuxtApp()
  const searchTerm = ref<string>('')

  const { headerLinks } = useHeaderLinks()
  const { footerLinks } = useFooterLinks()

  const searchLinks = computed(() => [
    ...headerLinks.value.filter((link): link is NonNullable<typeof link> => Boolean(link)),
    // {
    //   label: 'Team',
    //   icon: 'i-lucide-users',
    //   to: '/team',
    // },
    // {
    //   label: 'Design Kit',
    //   icon: 'i-lucide-palette',
    //   to: '/design-kit',
    // },
    // {
    //   label: 'Newsletter',
    //   icon: 'i-lucide-mail',
    //   to: '/newsletter',
    // },
  ])

  // interface SearchGroup {
  //   id: string
  //   label: string
  //   icon?: string
  //   items: Array<{
  //     id: string
  //     label: string
  //     suffix?: string
  //     icon?: string
  //     avatar?: {
  //       src?: string
  //       ui?: {
  //         root: string
  //       }
  //     }
  //     to: string
  //     onSelect?: () => Promise<void>
  //   }>
  // }

  // const searchGroups = computed<SearchGroup[]>(() => {
  //   const aiGroup: SearchGroup = {
  //     id: 'ask-ai-search',
  //     label: 'AI',
  //     icon: 'i-lucide-wand',
  //     items: [],
  //   }

  //   const modulesGroup: SearchGroup = {
  //     id: 'modules-search',
  //     label: 'Modules',
  //     items: [],
  //   }

  //   const hostingGroup: SearchGroup = {
  //     id: 'hosting-search',
  //     label: 'Hosting',
  //     items: [],
  //   }

  //   const groups = [aiGroup, modulesGroup, hostingGroup]

  //   if (!searchTerm.value) {
  //     return groups
  //   }

  //   aiGroup.items = [{
  //     id: `ask-ai-${searchTerm.value}`,
  //     label: `Ask AI about "${searchTerm.value}"`,
  //     icon: 'i-lucide-wand',
  //     to: 'javascript:void(0);',
  //     onSelect() {
  //       return nuxtApp.$kapa.openModal(searchTerm.value)
  //     },
  //   }]

  //   const loadModules = async () => {
  //     const { modules, fetchList } = useModules()
  //     if (!modules.value.length) {
  //       await fetchList()
  //     }

  //     modulesGroup.items = modules.value
  //       .filter(module => ['name', 'npm', 'repo'].map(field => module[field as keyof typeof module]).filter(Boolean).some(value => typeof value === 'string' && value.search(searchTextRegExp(searchTerm.value)) !== -1))
  //       .map(module => ({
  //         id: `module-${module.name}`,
  //         label: module.npm,
  //         suffix: module.description,
  //         avatar: {
  //           src: moduleImage(module.icon),
  //           ui: {
  //             root: 'rounded-none bg-transparent',
  //           },
  //         },
  //         to: `/modules/${module.name}`,
  //       }))
  //   }

  //   const loadHosting = async () => {
  //     const { providers, fetchList } = useHostingProviders()
  //     if (!providers.value.length) {
  //       await fetchList()
  //     }

  //     hostingGroup.items = providers.value
  //       .filter(hosting => ['title'].map(field => hosting[field as keyof typeof hosting]).filter(Boolean).some(value => typeof value === 'string' && value.search(searchTextRegExp(searchTerm.value)) !== -1))
  //       .map(hosting => ({
  //         id: `hosting-${hosting.path}`,
  //         label: hosting.title,
  //         suffix: hosting.description,
  //         icon: hosting.logoIcon,
  //         avatar: hosting.logoSrc
  //           ? {
  //               src: hosting.logoSrc,
  //               ui: {
  //                 root: 'rounded-none bg-transparent',
  //               },
  //             }
  //           : undefined,
  //         to: hosting.path,
  //       }))
  //   }

  //   onMounted(() => {
  //     Promise.all([
  //       loadModules(),
  //       loadHosting(),
  //     ]).catch(error => console.error('Error loading search results:', error))
  //   })

  //   return groups
  // })

  return {
    searchTerm,
    headerLinks,
    footerLinks,
    searchLinks,
    // searchGroups,
  }
}

export const useNavigation = import.meta.client ? createSharedComposable(_useNavigation) : _useNavigation
