import type { Author } from '~/types'

/**
 * Composable to fetch and manage author details, reusing previously loaded authors.
 *
 * This composable fetches author details based on provided names or objects,
 * ensuring already loaded authors are reused. It only fetches authors that are not loaded yet.
 *
 * @returns An object with authors state and a method to fetch authors.
 */
export async function useAuthors(names?: string[] | string | object[] | object | undefined) {
  const storedAuthors = useState<Author[]>('storedAuthors', () => [])

  // Reactive state for current author list
  const authors = ref<Author[]>([])

  if (names) {
    await fetchAuthors(names)
  }

  // Function to check if an author is already loaded
  function isAuthorLoaded(name: string) {
    return storedAuthors.value.some(author => author.name === name)
  }

  // Function to fetch authors based on the provided names
  async function fetchAuthors(names: string[] | string | object[] | object | undefined) {
    if (!names) {
      return []
    }

    // Normalize input names into an array
    const normalizedAuthors = Array.isArray(names) ? names : [names]

    // Filter out names that are already loaded
    const placeholders = normalizedAuthors.filter(input =>
      typeof input === 'string' && !isAuthorLoaded(input as string),
    )

    // Fetch author details only if there are placeholders (names not yet loaded)
    if (placeholders.length > 0) {
      const fetchedAuthors = await queryContent('_users')
        .where({ name: { $in: placeholders } })
        .only(['title', 'name', 'to', 'avatar'])
        .find()

      // Update the stored authors with newly fetched ones
      storedAuthors.value.push(...fetchedAuthors)
    }

    // Map the normalized authors to either stored objects or keep the original object
    authors.value = normalizedAuthors.map((input) => {
      if (typeof input === 'string') {
        return storedAuthors.value.find(author => author.name === input) || {}
      }
      return input
    })

    return authors.value
  }

  return {
    authors,
    fetchAuthors,
  }
}
