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

export function useBlog() {
  const articles = useState<BlogArticle[]>('articles', () => [])
  // const featuredArticle: Ref<BlogArticle | {}> = useState('featured-article', () => ({}))

  // Data fetching

  async function fetchList() {
    if (articles.value.length)
      return

    try {
      const data = await queryContent<BlogArticle>('/blog')
        .where({ _extension: 'md' })
        .without(['body', 'excerpt'])
        .sort({ date: -1 })
        .find()

      articles.value = (data as BlogArticle[]).filter(article => article._path !== '/blog')
      // featuredArticle.value = articles.value?.shift() || {}
    }
    catch (e) {
      articles.value = []
      return e
    }
  }

  return {
    articles,
    // featuredArticle,
    fetchList,
  }
}
