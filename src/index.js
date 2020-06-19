import { getUnreadArticleCount } from './utilities';
import { updateBadgeTextWithUnreadCount } from './badge';
import { getStorage, setStorage } from './storage';

let articles = [];

registerEventListeners();

updateRecentArticlesNode();
updateFreeArticlesNode();

function updateRecentArticlesNode() {
  let recentArticles = document.getElementById('articleList');

  emptyDOMNode(recentArticles);

  articles = [];
  
  getStorage(null).then(items => {
    for (var link in items) {
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

  getStorage(['lastView', 'freeCount', 'subscription']).then(items => {
    let subscription = items['subscription'];

    if (subscription) {
      generateUnlimitedAccessHTML();
      clearSigninMessage();
    } else if (items['lastView']) {
      // if we don't have a lastView timestamp then the freeCount is worthless because it might be a new month
      let lastViewMonth = new Date(items['lastView']).getMonth();
      let currentMonth = new Date().getMonth();

      if (lastViewMonth == currentMonth) {
        generateFreeArticlesHTML(items['freeCount']);
      } else {
        generateFreeArticlesHTML(6);
      }

      generateSigninMessage();
    } else {
      generateFreeArticlesHTML(null);

      if (subscription) {
        clearSigninMessage();
      } else {
        generateSigninMessage();
      }
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

function generateUnlimitedAccessHTML() {
  let freeArticlesNode = document.getElementById('freeArticles');

  let h3 = document.createElement('h3');
  h3.textContent = 'You have unlimited access, thank you for your support!';

  freeArticlesNode.appendChild(h3);
}

function generateSigninMessage() {
  let signInParent = document.getElementById('signinMessage');

  let a = document.createElement('a');
  a.setAttribute('href', 'https://buy.tinypass.com/tkt/ps/login?r=%7Bjzx%7DLcbrKsQKJAlGr2BTN4pNuYYrQRmnKAu6YPLKZ-eXNrOv5uh2Ku4o2SsS9ViKE3d9xdsnkQ6hQKwsTod_h_TJ_LghGKZCCKqHuJGVU5JZkjzk0hekR39g_0ImoOwCfD6lWC8TFvhBYmCYrrGdQZB9pJiU3rWOiOPBJcHVLpgIlcUb7ov0_cjt68jwAwxhmRW_Z7_8A9tTgGS1FC48zwoz3-Wgjo6RLd0H_nD9i2rdODBKsCmAzQZSQAIFZvLkg3Ibipwpa6HVCfOyPNJUpwku9ldwVRLXiYK7MH9762mmsRqTbhmMMhYk1fDH3Oj-bjdJKuJWqaHRokHtv-Yjk3sJf_OcM0AHlZzVYrw8CgG8WdsHlIMyEi3JYb0Z3kYI-wom&src=m&trans_id=k3y7urcb-z1seyf2pru&aid=FQWckFzLcA');
  a.setAttribute('target', '_blank');
  a.textContent = 'login';

  signInParent.innerHTML = 'Please ';
  signInParent.appendChild(a);
  signInParent.innerHTML = signInParent.innerHTML + ' to get access to unlimited stories';
}

function clearSigninMessage() {
  let signinParent = document.getElementById('signinMessage');
  signinParent.innerHTML = '';
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
  getStorage(null).then(items => {
    for (var link in items) {
      let article = items[link];

      if (article.pubDate != null && !article.viewed) {
        article.viewed = true;

        setStorage({[link]: article}).then(() => {
          updateRecentArticlesNode();
          updateBadgeTextWithUnreadCount();
        });
      }
    }
  });
}

function notInterested(e) {
  let link = e.target.getAttribute('data-article');

  getStorage(link).then(article => {
    let keys = Object.keys(article);
    article[keys[0]].viewed = true;

    setStorage(article).then(() => {
      updateRecentArticlesNode();
      updateBadgeTextWithUnreadCount();
    });
  });
}

function reportBug() {
  window.open('https://github.com/burke1791/illiniboard-extension/issues', '_blank');
}