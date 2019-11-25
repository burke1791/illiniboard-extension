let articles = [];

chrome.storage.sync.get(null, items => {
  for (link in items) {
    let date = new Date(items[link].pubDate);
    items[link].pubDate = date;
    items[link].url = link;
    articles.push(items[link]);
  }

  // reorder articles in descending post order
  articles.sort((a, b) => {return b.pubDate - a.pubDate});

  addArticlesToDOM();
});

let addArticlesToDOM = () => {
  for (var i = 0; i <= 2; i++) {
    let articleHTML = generateArticleHTML(articles[i]);
    insertArticleRow(articleHTML);
  }
}

let generateArticleHTML = (articleObj) => {
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
  timestamp.textContent = articleObj.pubDate;

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

let insertArticleRow = (articleHTML) => {
  let recentArticles = document.getElementById('articleList');
  let hr = document.createElement('hr');

  recentArticles.appendChild(articleHTML);
  recentArticles.appendChild(hr);
}

let notInterested = (e) => {
  console.log(e.target.getAttribute('data-article'));
}