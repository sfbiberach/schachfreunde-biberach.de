export async function useAuthors(names: string[] | string | object[] | object | undefined) {
  if (!names) {
    return []
  }

  const authors = Array.isArray(names) ? names : [names]
  const placeholders = authors.filter(input => typeof input === 'string')

  if (placeholders.length > 0) {
    const fetchedAuthors = await queryContent('_users')
      .where({ name: { $in: placeholders } })
      .only(['title', 'name', 'to', 'avatar'])
      .find()

    for (let i = 0, j = 0; j < authors.length; j++) {
      if (typeof authors[j] === 'string') {
        authors[j] = fetchedAuthors[i++] || {}
      }
    }
  }

  return authors
}
