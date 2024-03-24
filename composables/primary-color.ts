export function usePrimaryColor(color?: string) {
  const primaryColor = useState('primary-color', () => '')
  const appConfig = useAppConfig()
  if (color) {
    primaryColor.value = color
    appConfig.ui.primary = primaryColor.value
    localStorage.setItem('primary-color', primaryColor.value)
  }
  else if (!primaryColor.value) {
    appConfig.ui.primary = primaryColor.value = localStorage.getItem('primary-color') || appConfig.ui.primary
  }

  return primaryColor
}
