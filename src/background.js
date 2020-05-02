import { updateBadgeTextWithUnreadCount } from './badge.js';
import { setStorage, getStorage } from './storage';
import { getUnreadArticleCount } from './utilities';

let articles = [];

chrome.runtime.onInstalled.addListener(options => {
  if (options.reason == 'install') {
    let installDate = new Date();
    setStorage({'installDate': installDate.toLocaleString()});
  }

  requestIlliniboardRSS(true);
});

chrome.webNavigation.onCompleted.addListener(function() {
  requestIlliniboardRSS(false);
});

let req = new XMLHttpRequest();
req.addEventListener('load', handleXML);

requestIlliniboardRSS(false);

function requestIlliniboardRSS(forceReq) {
  // only hit the RSS feed if it's been 5 minutes since the last poll
  getStorage('lastPoll').then(items => {
    let lastPoll = new Date(items['lastPoll']);
    let now = new Date();

    let diff = Math.abs(now - lastPoll);
    let diffMin = Math.ceil(diff / 1000 / 60);
    
    if (diffMin > 5 || forceReq) {
      let ibRSS = 'https://illiniboard.com/static/rss/rss.xml'

      req.open('GET', ibRSS + ((/\?/).test(ibRSS) ? "&" : "?") + (new Date()).getTime());
      req.send();
    } else {
      // update badge in case article read booleans unexpectedly changed
      updateBadge();
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
  getStorage(article.link).then(item => {
    if (Object.keys(item).length == 0) {
      setStorage({
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
  let unreadCount = 0;

  getStorage(null).then(items => {
    let lastView = items['lastView'];

    if (lastView != null) {
      let lastViewDate = new Date(lastView);

      unreadCount = getUnreadArticleCount(items, lastViewDate);

      updateBadgeTextWithUnreadCount(unreadCount);
    }
  });
}

function setLatestPollDate() {
  let pollDate = new Date().toLocaleString();
  setStorage({ 'lastPoll': pollDate });
}