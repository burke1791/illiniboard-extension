let articles = [];

let req = new XMLHttpRequest();
req.addEventListener('load', handleXML);

requestIlliniboardRSS();

function requestIlliniboardRSS() {
  let ibRSS = 'https://illiniboard.com/static/rss/rss.xml'

  req.open('GET', ibRSS + ((/\?/).test(ibRSS) ? "&" : "?") + (new Date()).getTime());
  req.send();
}

// this function did not get hoisted when I had it below - not sure why
function handleXML() {
  let ibXML = req.responseXML;
  articles = [];

  if (ibXML.hasChildNodes()) {
    let items = ibXML.getElementsByTagName('item');

    for (var i = 0; i < items.length; i++) {
      let article = {};
      populateArticleObj(article, items[i]);
      articles.push(article);
      saveArticlesInStorage(article);
    }

    updateBadge();
  }
}

function populateArticleObj(article, item) {
  for (var i = 0; i < item.childElementCount; i++) {
    let node = item.children[i];
    // title

    if (node.nodeName.toLowerCase() == 'title') {
      article.title = node.textContent;
    }

    // link
    if (node.nodeName.toLowerCase() == 'link') {
      article.link = node.textContent;
    }

    // description
    if (node.nodeName.toLowerCase() == 'description') {
      article.description = node.textContent;
    }

    // pubDate
    if (node.nodeName.toLowerCase() == 'pubdate') {
      article.pubDate = node.textContent;
    }
  }
}

function saveArticlesInStorage(article) {
  // only set it in storage if it doesn't already exist
  chrome.storage.sync.get(article.link, item => {
    if (Object.keys(item).length == 0) {
      chrome.storage.sync.set({
        [article.link]: {
          "title": article.title,
          "pubDate": article.pubDate,
          "description": article.description,
          "viewed": false
        }
      });
    }
  });
}

function updateBadge() {
  chrome.storage.sync.get('lastView', item => {
    if (item.lastView != null) {
      let lastView = new Date(item['lastView']);

      let unreadCount = getUnreadCount(lastView);

      if (unreadCount > 0) {
        chrome.browserAction.setBadgeText({text: unreadCount});
      } else {
        chrome.browserAction.setBadgeText({text: ""});
      }
    } else {
      chrome.browserAction.setBadgeText({text: ""});
    }
  });
}

function getUnreadCount(lastView) {
  let count = 0;

  for (var article of articles) {
    let pubDate = new Date(article.pubDate);

    if (pubDate > lastView) {
      count++;
    }
  }

  return count;
}