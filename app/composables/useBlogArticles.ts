export function useBlogArticle() {
  const route = useRoute()
  const cacheKey = computed(() => `blog-article:${route.path}`)

  return useAsyncData(cacheKey, async () => {
    // 1) load the main article
    const article = await queryCollection('blog')
      .path(route.path)
      .first()

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Artikel nicht gefunden',
      })
    }

    // 2) load the author record
    //    assume `article.author` is the slug/id in your `user` collection
    const authors = await queryCollection('user')
      .where('slug', 'IN', article.authors)
      .first()

    // 3) load prev/next (surrounding) posts
    const surround = await queryCollectionItemSurroundings('blog', route.path)
      .where('published', '=', true)
      .order('date', 'DESC')

    return { article, authors, surround }
  })

  // return {
  //   article: computed(() => data.value?.article),
  //   author: computed(() => data.value?.author),
  //   surround: computed(() => data.value?.surround ?? []),
  // }
}
