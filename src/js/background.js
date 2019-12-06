let articles = [];

chrome.runtime.onInstalled.addListener(options => {
  if (options.reason == 'install') {
    let installDate = new Date();
    chrome.storage.sync.set({'installDate': installDate.toLocaleString()});
  }
});

chrome.webNavigation.onCompleted.addListener(function() {
  requestIlliniboardRSS();
});

let req = new XMLHttpRequest();
req.addEventListener('load', handleXML);

requestIlliniboardRSS();

function requestIlliniboardRSS() {
  // only hit the RSS feed if it's been 5 minutes since the last poll
  chrome.storage.sync.get('lastPoll', items => {
    let lastPoll = new Date(items['lastPoll']);
    let now = new Date();

    let diff = Math.abs(now - lastPoll);
    let diffMin = Math.ceil(diff / 1000 / 60);

    if (diffMin > 5) {
      let ibRSS = 'https://illiniboard.com/static/rss/rss.xml'

      req.open('GET', ibRSS + ((/\?/).test(ibRSS) ? "&" : "?") + (new Date()).getTime());
      req.send();
    }
  });
}

function handleXML() {
  // log the updated pollDate
  setLatestPollDate();

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
    // set lastView to the unix epoch if it doesn't exist
    let lastView = item.lastView != null ? new Date(item['lastView']) : new Date(0);

    getUnreadCount(lastView).then(unreadCount => {
      if (unreadCount > 9) {
        chrome.browserAction.setBadgeText({text: "9+"});
      } else if (unreadCount > 0) {
        chrome.browserAction.setBadgeText({text: String(unreadCount)});
      } else {
        chrome.browserAction.setBadgeText({text: ""});
      }
    });
  });
}

function getUnreadCount(lastView) {
  let count = 0;

  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, articles => {
      for (var link in articles) {
        if (articles[link].pubDate != null) {
          let pubDate = new Date(articles[link].pubDate);
      
          if (pubDate > lastView && !articles[link].viewed) {
            count++;
          }
        }
      }

      resolve(count);
    });
  });
}

function setLatestPollDate() {
  let pollDate = new Date().toLocaleString();

  chrome.storage.sync.set({'lastPoll': pollDate});
}