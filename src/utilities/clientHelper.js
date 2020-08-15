export function generateArticleData(article) {
  let propsObj = {
    articleId: article.ArticleId,
    description: article.Description,
    pubDate: new Date(article.PublishDate),
    title: article.Title,
    url: article.Url
  };

  return propsObj;
}

/**
 * @function setArticlesViewed - sets the "viewed" property to true for the provided article id. If 'id' is undefined then set "viewed" to true for all articles
 * @param {Array<object>} articles
 * @param {number} id - the unique article id to set
 */
export function setArticlesViewed(articles, id) {
  for (var article of articles) {
    if (id == undefined || article.ArticleId == id) {
      article.viewed = true;
    }
  }

  return articles;
}