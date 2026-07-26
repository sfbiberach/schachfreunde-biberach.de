import { createSharedComposable } from '@vueuse/core'

function _useHeaderLinks() {
  const appConfig = useAppConfig()
  const route = useRoute()

  const headerLinks = computed(() =>
    appConfig.app.links.header.map(link => ({
      ...link,
      active: isNavigationTargetActive(route.path, link.to),
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
        active: isNavigationTargetActive(route.path, child.to),
      })),
    })),
  )
  return { footerLinks }
}

export const useFooterLinks = import.meta.client ? createSharedComposable(_useFooterLinks) : _useFooterLinks
