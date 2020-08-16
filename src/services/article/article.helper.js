import { getStorage } from "../../utilities/storage";

export function generateCheckArticleApiParams(extensionId) {
  let params = {};

  if (extensionId !== undefined) {
    params.extensionGuid = extensionId;
  }

  return new Promise((resolve, reject) => {
    getStorage('prevArticleId').then(data => {
      if (data.prevArticleId !== undefined) {
        params.prevArticleId = +data.prevArticleId
      }

      resolve(params);
    });
  });
}

export function getLocalArticleViews() {
  let articleArr = [];

  return new Promise((resolve, reject) => {
    getStorage('articles').then(data => {
      if (Array.isArray(data.articles) && data.articles.length > 0) {
        articleArr = populateViewedArticleArray(data.articles);
      }

      resolve(articleArr);
    });
  });
}

function populateViewedArticleArray(data) {
  let arr = [];
  console.log(data);

  data.forEach(article => {
    if (article.viewed) {
      arr.push(article.ArticleId);
    }
  });

  return arr;
}