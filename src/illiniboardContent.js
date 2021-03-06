import { setStorage, getStorage } from './utilities/storage';

updateLastVisit();

// in case some resources are slow to load, this should catch them
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    mainUpdate();
  }
}

function mainUpdate() {
  if (window.location.pathname.includes('story/')) {
    updateFreeArticleCount();
    updateArticleReadStatus();
  }
}

function updateLastVisit() {
  let now = new Date().toISOString();
  setStorage({'lastView': now});
}

function updateFreeArticleCount() {
  let counter = document.getElementsByClassName('tpm-numeral');

  if (counter.length == 1) {
    let freeCount = Number(counter.item(0).textContent);

    setStorage({
      'freeCount': freeCount,
      'subscription': false
    });
  } else {
    setStorage({
      'freeCount': -1,
      'subscription': true
    })
  }
}

function updateArticleReadStatus() {
  let url = window.location.href;

  url = removeTrailingSlash(url);
  
  getStorage('articles').then(data => {
    let articles = data.articles;

    for (var article of articles) {
      if (article.Url == url) {
        article.viewed = true;
      }
    }

    return articles;
  }).then(articles => {
    setStorage({ 'articles': articles });
  });
}

function removeTrailingSlash(url) {
  return url.replace(/\/+$/, "");
}