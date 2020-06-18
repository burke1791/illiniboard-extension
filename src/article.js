
export function generateArticleObj(item) {
  let article = {};

  article.title = extractArticleProperty(item, 'title');
  article.link = extractArticleProperty(item, 'link');
  article.description = extractArticleProperty(item, 'description');
  article.pubDate = extractArticleProperty(item, 'pubDate');

  return article;
}

export function extractArticleProperty(node, tag) {
  let prop = node.getElementsByTagName(tag)[0];

  return prop.textContent;
}