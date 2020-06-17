
const getUnreadArticleCount = (articles, lastViewDate) => {
  let unreadCount = 0;

  for (var key in articles) {
    let article = articles[key];

    let articlePubDate = article.pubDate != null ? new Date(article.pubDate) : false;

    // increment the unread count if the current article hasn't been viewed
    if (articlePubDate && !article.viewed && articlePubDate > lastViewDate) {
      unreadCount ++;
    }
  }
  console.log(unreadCount);
  return unreadCount;
}

export {
  getUnreadArticleCount
};