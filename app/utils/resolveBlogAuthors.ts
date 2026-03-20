export default async function (articles: any[]) {
  for (const article of articles) {
    if (article.authors) {
      article.resolvedAuthors = await resolveAuthors(article.authors)
    }
  }
}
