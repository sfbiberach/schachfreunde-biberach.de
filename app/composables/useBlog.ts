export function useBlog(page?: number, perPage?: number) {
  return useAsyncData(`blog:${page}-${perPage}`, () => {
    const q = queryCollection('blog')
      .where('extension', '=', 'md')
      .order('date', 'DESC')

    if (typeof page === 'number') {
      const take = perPage ?? 12
      const skip = (page - 1) * take
      q.skip(skip).limit(take)
    }

    return q.all()
  })
}
