export function usePrimaryColor(color?: string) {
  const appConfig = useAppConfig()

  if (color) {
    appConfig.ui.primary = color
    window.localStorage.setItem('nuxt-ui-primary', color)
  }

  return appConfig.ui.primary
}
