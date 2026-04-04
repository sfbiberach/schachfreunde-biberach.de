import type { BadgeProps } from '#ui/types'

/**
 * Resolves a badge for a blog article based on its category and a categories map.
 * Returns a BadgeProps object with label and color.
 */
export default function resolveBadge(
  category: string,
  categoriesMap: Record<string, BadgeProps> | undefined,
): BadgeProps {
  const badge = categoriesMap?.[category]
  if (badge) {
    return badge
  }
  return {
    label: category || '',
    color: 'neutral',
  }
}
