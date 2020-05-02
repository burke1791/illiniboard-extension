
const getUnreadArticleCount = (articles, lastViewDate) => {
  let unreadCount = 0;

  for (var key in articles) {
    let article = articles[key];

    // if object is an article object
    if (article.pubDate != null) {
      let articlePubDate = new Date(article.pubDate);

      // if the article was published after the user's last visit
      if (!article.viewed && articlePubDate > lastViewDate) {
        unreadCount++;
      }
    }
  }

  return unreadCount;
}

export {
  getUnreadArticleCount
};