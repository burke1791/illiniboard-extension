let articles = [];

// this function did not get hoisted when I had it below - not sure why
const handleXML = () => {
  let ibXML = req.responseXML;

  if (ibXML.hasChildNodes()) {
    let items = ibXML.getElementsByTagName('item');

    for (var i = 0; i < items.length; i++) {
      let article = {};
      populateArticleObj(article, items[i]);
      saveArticlesInStorage(article);
      chrome.browserAction.setBadgeText({text: "69"});
    }

  }
}

let req = new XMLHttpRequest();
req.addEventListener('load', handleXML);
req.open('GET', 'https://illiniboard.com/static/rss/rss.xml');
req.send();

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