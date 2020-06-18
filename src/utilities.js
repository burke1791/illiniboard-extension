
export function getUnreadArticleCount(articles, lastViewDate) {
  let unreadCount = 0;

  for (var key in articles) {
    let article = articles[key];

    let articlePubDate = getArticlePubDate(article);

    unreadCount += computeUnreadCount(article, articlePubDate, lastViewDate);
  }

  return unreadCount;
}

function getArticlePubDate(article) {
  return article.pubDate != null ? new Date(article.pubDate) : false
}

// increment the unread count if the current article hasn't been viewed
function computeUnreadCount(article, articlePubDate, lastViewDate) {
  if (articlePubDate && !article.viewed && articlePubDate > lastViewDate) {
    return 1;
  }

  return 0;
}