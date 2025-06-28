export function usePrimaryColor(color?: string) {
  const appConfig = useAppConfig()

  if (color) {
    appConfig.ui.colors.primary = color
    window.localStorage.setItem('nuxt-ui-primary', color)
  }

  return appConfig.ui.colors.primary
}
