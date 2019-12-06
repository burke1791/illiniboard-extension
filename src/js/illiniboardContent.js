updateLastVisit();
updateFreeArticleCount();
updateArticleReadStatus();

// in case some resources are slow to load, this should catch them
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    updateFreeArticleCount();
  }
}

function updateLastVisit() {
  let now = new Date().toISOString();

  chrome.storage.sync.set({
    'lastView': now
  });
}

function updateFreeArticleCount() {
  let counter = document.getElementsByClassName('tpm-numeral');

  if (counter.length == 1) {
    let freeCount = Number(counter.item(0).textContent);

    chrome.storage.sync.set({
      'freeCount': freeCount
    });
  }
}

function updateArticleReadStatus() {
  let url = window.location.href;

  url = removeTrailingSlash(url);
  
  chrome.storage.sync.get(url, article => {
    let keys = Object.keys(article);
    article[keys[0]].viewed = true;
    chrome.storage.sync.set(article);
  });
}

function removeTrailingSlash(url) {
  return url.replace(/\/+$/, "");
}