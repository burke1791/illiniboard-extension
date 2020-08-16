import { generateCheckArticleApiParams, getLocalArticleViews } from "./article.helper";
import { apiGet, apiPost } from "../../utilities/apiService";
import { ENDPOINTS } from "../../utilities/constants";
import { getStorage, setStorage } from "../../utilities/storage";

export async function fetchNewArticles(extensionId) {
  if (extensionId === undefined) {
    throw new Error('Please supply an extensionId');
  }

  try {
    let apiParams = await generateCheckArticleApiParams(extensionId);
    let articleArr = await apiGet(ENDPOINTS.CHECK_NEW_ARTICLES, apiParams);

    articleArr = JSON.parse(articleArr);
    return articleArr;
  } catch (error) {
    // articleArr is most likely not valid JSON, return an empty array
    return [];
  }
}

export async function sendArticleViews(extensionId) {
  if (extensionId === undefined) {
    throw new Error('Please supply an extensionId');
  }

  try {
    let articleIds = await getLocalArticleViews();

    if (articleIds.length === 0 || !Array.isArray(articleIds)) {
      return [];
    }

    let params = {
      body: {
        articleIds: articleIds,
        extensionGuid: extensionId
      }
    };

    console.log(params);

    let response = await apiPost(ENDPOINTS.SEND_ARTICLE_VIEWS, params);
    let articleArr = JSON.parse(response);

    return articleArr;
  } catch (error) {
    // likely an error parsing JSON
    return [];
  }
}

export function purgeViewedArticles(viewed) {
  return new Promise((resolve, reject) => {
    getStorage('articles').then(data => {
      let articles = data.articles;
      let remainingArticles = [];
  
      if (articles !== undefined) {
        remainingArticles = articles.filter(articleObj => {
          let keepFlag = true;
  
          for (var viewedId of viewed) {
            let id = +viewedId.ArticleId;
  
            if (id == +articleObj.ArticleId) {
              keepFlag = false;
            }
          }
  
          return keepFlag
        });
      }
  
      return remainingArticles;
    }).then(articles => {
      return setStorage({ 'articles': articles });
    }).then(data => {
      resolve();
    });
  });
}

export function storeNewArticles(articles) {
  return new Promise((resolve, reject) => {
    getStorage('articles').then(data => {
      let currentArticles = data.articles;
      let newArticles = [];

      if (currentArticles.length > 0) {
        newArticles = identifyNewArticles(currentArticles, articles);
      }

      return [...currentArticles, ...newArticles];
    }).then(articles => {
      console.log(articles);
      return setStorage({ 'articles': articles });
    }).then(() => {
      resolve();
    });
  });
}

function identifyNewArticles(current, incoming) {
  return incoming.filter(article => {
    let keepFlag = true;
    for (currentObj of current) {
      if (currentObj.ArticleId == article.ArticleId) {
        keepFlag = false;
      }
    }

    return keepFlag;
  });
}