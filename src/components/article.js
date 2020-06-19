
function Article(props) {
  this.articleMetaData = {
    url: props.url,
    title: props.title,
    timestamp: props.timestamp
  };
  this.articleInterest = {
    url: props.url,
    clickListener: props.interestClickListener
  };

  function render() {
    let article = document.createElement('div');
    article.setAttribute('class', 'article');

    let articleMeta = new ArticleMetaData(this.articleMetaData);
    article.appendChild(articleMeta);

    let articleInterest = new ArticleInterest(this.articleInterest);
    article.appendChild(articleInterest);

    return article;
  }

  return render();
}

function ArticleMetaData(props) {
  this.url = props.url;
  this.title = props.title;
  this.timestamp = props.timestamp;

  function render() {
    let meta = document.createElement('div');
    meta.setAttribute('class', 'left');

    let title = document.createElement('div');
    title.setAttribute('class', 'title');

    let link = document.createElement('a');
    link.setAttribute('href', this.url);
    link.setAttribute('target', '_blank');

    let titleText = document.createElement('h4');
    titleText.setAttribute('class', 'article-title');
    titleText.textContent = this.title;

    link.appendChild(titleText);
    title.appendChild(link);
    meta.appendChild(title);

    let pubDate = document.createElement('div');
    pubDate.setAttribute('class', 'pubdate');

    let timestamp = document.createElement('span');
    timestamp.textContent = this.timestamp.toLocaleString();

    pubDate.appendChild(timestamp);
    meta.appendChild(pubDate);

    return meta;
  }

  return render();
}

function ArticleInterest(props) {
  this.url = props.url;
  this.clickListener = props.clickListener;

  function render() {
    let interestDisplay = document.createElement('div');
    interestDisplay.setAttribute('class', 'right');

    let interest = document.createElement('div');
    interest.setAttribute('class', 'interest');

    let btn = document.createElement('button');
    btn.setAttribute('class', 'interest-btn');
    btn.setAttribute('data-article', this.url);
    btn.textContent = 'Not Interested?';

    btn.addEventListener('click', this.clickListener);

    interest.appendChild(btn);
    interestDisplay.appendChild(interest);

    return interestDisplay;
  }

  return render();
}

export default Article;