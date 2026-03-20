export function formatDate(date?: string | number | Date): string {
  return new Date(date || 0).toLocaleDateString('de', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
