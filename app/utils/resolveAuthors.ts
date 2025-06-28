export default function (authors: string | Array<string>) {
  const _authors = Array.isArray(authors) ? authors : [authors]
  return queryCollection('user')
    .where('name', 'IN', _authors)
    .select('name', 'description', 'to', 'avatar')
    .all()
}
