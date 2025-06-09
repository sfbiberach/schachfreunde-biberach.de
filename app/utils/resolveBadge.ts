import type { BadgeProps } from '#ui/types'

/**
 * Resolves a badge for a blog article based on its category and a categories map.
 * Returns a BadgeProps object with label and color.
 * Falls back to appConfig.app.blog.categories if categoriesMap is not provided.
 */
export default function resolveBadge(
  category: string,
  categoriesMap: Record<string, BadgeProps> | undefined = useAppConfig().app.blog.categories as Record<string, BadgeProps> | undefined,
): BadgeProps {
  const badge = categoriesMap?.[category as keyof typeof categoriesMap]
  if (badge) {
    return badge
  }
  return {
    label: category || '',
    color: 'neutral',
  }
}
