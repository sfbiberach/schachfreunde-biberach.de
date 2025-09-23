import type { CommandPaletteGroup } from '@nuxt/ui'
import type { ContentSearchItem } from '@nuxt/ui/runtime/types/content.js'
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
  const searchTerm = ref<string>('')

  const { headerLinks } = useHeaderLinks()
  const { footerLinks } = useFooterLinks()

  const groups = computed<CommandPaletteGroup<ContentSearchItem>[]>(() =>
    footerLinks.value.map(group => ({
      id: group.label,
      label: group.label,
      items: group.children || [],
    })),
  )

  return {
    searchTerm,
    headerLinks,
    footerLinks,
    groups,
  }
}

export const useNavigation = import.meta.client ? createSharedComposable(_useNavigation) : _useNavigation
