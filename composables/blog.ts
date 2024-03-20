import type { BlogArticle } from '~/types'

export async function useAuthors(names: string[] | string | object[] | object | undefined) {
  if (!names)
    return []

  const normalizedAuthors = Array.isArray(names) ? names : [names]

  const authorPromises = normalizedAuthors.map((name) => {
    if (typeof name === 'string')
      return useAsyncData(`users/${name}`, () => queryContent('_users').where({ name }).findOne()).then(user => user?.data?.value || {})

    return Promise.resolve(name)
  })
  const resolvedAuthors = await Promise.all(authorPromises)
  return resolvedAuthors
}
