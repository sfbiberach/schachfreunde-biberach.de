export function isNavigationTargetActive(currentPath: string, target: string) {
  if (!target.startsWith('/')) {
    return false
  }

  const normalizedTarget = target === '/' ? target : target.replace(/\/+$/, '')

  return currentPath === normalizedTarget
    || (normalizedTarget !== '/' && currentPath.startsWith(`${normalizedTarget}/`))
}
