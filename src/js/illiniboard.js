let articles = [];

registerEventListeners();

updateRecentArticlesNode();
updateFreeArticlesNode();

function updateRecentArticlesNode() {
  let recentArticles = document.getElementById('articleList');

  emptyDOMNode(recentArticles);

  articles = [];
  
  chrome.storage.sync.get(null, items => {
    for (link in items) {
      if (items[link].pubDate != null) {
        let date = new Date(items[link].pubDate);
        items[link].pubDate = date;
        items[link].url = link;
        articles.push(items[link]);
      }
    }
  
    // reorder articles in descending post order
    articles.sort((a, b) => {return b.pubDate - a.pubDate});
    addArticlesToDOM();
  });
}

function updateFreeArticlesNode() {
  let freeArticles = document.getElementById('freeArticles');

  emptyDOMNode(freeArticles);

  chrome.storage.sync.get(['lastView', 'freeCount'], items => {
    // if we don't have a lastView timestamp then the freeCount is worthless because it might be a new month
    if (items['lastView']) {
      let lastViewMonth = new Date(items['lastView']).getMonth();
      let currentMonth = new Date().getMonth();

      if (lastViewMonth == currentMonth) {
        generateFreeArticlesHTML(items['freeCount']);
      } else {
        generateFreeArticlesHTML(6);
      }
    } else {
      generateFreeArticlesHTML(null);
    }
  });
}

const addArticlesToDOM = () => {
  let count = 0;
  let newArticles = false;

  for (var article of articles) {
    if (count <= 2 && !article.viewed) {
      newArticles = true;

      let articleHTML = generateArticleHTML(article);
      insertArticleRow(articleHTML);

      count++;
    }
  }

  if (!newArticles) {
    insertNoNewArticlesRow();
  }
}

const generateArticleHTML = (articleObj) => {
  let div = document.createElement('div');
  div.setAttribute('class', 'article');

  let left = document.createElement('div');
  left.setAttribute('class', 'left');

  let right = document.createElement('div');
  right.setAttribute('class', 'right');

  let title = document.createElement('div');
  title.setAttribute('class', 'title');

  let link = document.createElement('a');
  link.setAttribute('href', articleObj.url);
  link.setAttribute('target', '_blank');

  let titleText = document.createElement('h4');
  titleText.setAttribute('class', 'article-title');
  titleText.textContent = articleObj.title;

  link.appendChild(titleText);
  title.appendChild(link);
  left.appendChild(title);

  let pubDate = document.createElement('div');
  pubDate.setAttribute('class', 'pubdate');
  let timestamp = document.createElement('span');
  timestamp.textContent = articleObj.pubDate.toLocaleString();

  pubDate.appendChild(timestamp);
  left.appendChild(pubDate);

  let interest = document.createElement('div');
  interest.setAttribute('class', 'interest');
  let interestBtn = document.createElement('button');
  interestBtn.setAttribute('class', 'interest-btn');
  interestBtn.setAttribute('data-article', articleObj.url);
  interestBtn.textContent = 'Not Interested?';
  interestBtn.addEventListener('click', notInterested)

  interest.appendChild(interestBtn);
  right.appendChild(interest);

  div.appendChild(left);
  div.appendChild(right);

  return div;
}

const generateFreeArticlesHTML = (freeCount) => {
  let freeArticlesNode = document.getElementById('freeArticles');

  if (freeCount != null) {
    let h3 = document.createElement('h3');
    h3.textContent = 'Free Stories Remaining: ';

    let span = document.createElement('span');
    span.textContent = freeCount;

    h3.appendChild(span);
    freeArticlesNode.appendChild(h3);
  } else {
    let h3 = document.createElement('h3');
    h3.textContent = 'Your free stories will update after your next visit';

    freeArticlesNode.appendChild(h3);
  }
}

const insertArticleRow = (articleHTML) => {
  let recentArticles = document.getElementById('articleList');
  let hr = document.createElement('hr');

  recentArticles.appendChild(articleHTML);
  recentArticles.appendChild(hr);
}

const insertNoNewArticlesRow = () => {
  let recentArticles = document.getElementById('articleList');

  emptyDOMNode(recentArticles);

  recentArticles.appendChild(document.createElement('hr'));

  let p = document.createElement('p');
  p.textContent = 'No unread articles since your last visit';

  recentArticles.appendChild(p);
  recentArticles.appendChild(document.createElement('hr'));
}

function emptyDOMNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function registerEventListeners() {
  let resetUnreadBtn = document.getElementById('clearUnreadBtn');
  resetUnreadBtn.addEventListener('click', clearUnreadList);

  let bugBtn = document.getElementById('bug-btn');
  bugBtn.addEventListener('click', reportBug);
}

function clearUnreadList() {
  chrome.storage.sync.get(null, items => {
    for (var link in items) {
      let article = items[link];
      article.viewed = true;

      chrome.storage.sync.set({[link]: article}, () => {
        updateRecentArticlesNode();
      });
    }
  });
}

const notInterested = (e) => {
  let link = e.target.getAttribute('data-article');

  chrome.storage.sync.get(link, article => {
    let keys = Object.keys(article);
    article[keys[0]].viewed = true;

    chrome.storage.sync.set(article, () => {
      updateRecentArticlesNode();
    });
  });
}

function reportBug() {
  window.open('https://github.com/burke1791/illiniboard-extension/issues', '_blank');
}