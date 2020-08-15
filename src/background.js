import { updateBadgeTextWithUnreadCount } from './utilities/badge.js';
import { getExtensionId, getNewExtensionId } from './utilities/auth';
import { setStorage, getStorage } from './utilities/storage';
import { registerNewExtension } from './utilities/apiService';
import { timeDiff } from './utilities/helper';
import { ENDPOINTS } from './utilities/constants.js';
import { apiGet } from './utilities/apiService';
import { fetchNewArticles } from './services/article/article.service.js';

/**
 * @event onInstalled
 * @param options.reason {string} - reason for the event dispatch, can be one of:
 *  - install
 *  - update
 *  - chrome_update
 *  - shared_module_update
 */
chrome.runtime.onInstalled.addListener(options => {
  if (options.reason == 'install') {
    let installDate = new Date();
    setStorage({ 'installDate': installDate.toLocaleString() });
  }

  updateArticles();
});

/**
 * @event onCompleted
 * Event dispatched when the browser is finished loading a new page.
 * Used to conditionally ping the server for new articles
 */
chrome.webNavigation.onCompleted.addListener(function() {
  updateArticles();
});

/**
 * @function updateArticles
 * the main update loop for local article data
 */
async function updateArticles() {
  try {
    let extensionId = await getExtensionId('extensionId');
    
    // get a new id from the server
    if (!extensionId) {
      extensionId = await getNewExtensionId();
    }

    /**
     * @todo send "viewed" article id's to the server, then delete them from chrome storage
     */

    // let articles = await fetchNewArticles(extensionId);
    // console.log(articles);

    if (articles.length > 0) {
      // update local article storage
    }
  } catch (error) {
    console.log(error);
  }

  // checkNewArticles().then(response => {
  //   return response.json();
  // }).then(data => {
  //   let articles = JSON.parse(data);
  //   setArticleStorage(articles);
  //   setLatestPollDate();
  // }).catch(error => {
  //   console.log(error);
  //   updateBadgeTextWithUnreadCount();
  // });
}

/**
 * @function checkRegistration
 * returns the guid assigned to this browser extension - if it doesn't exist, then we ask the server for a new one
 */
// function checkRegistration() {
//   return new Promise((resolve, reject) => {
//     getStorage('extensionId').then(id => {
//       if (Object.keys(id).length === 0 && id.constructor === Object) {
//         return registerNewExtension();
//       }
//       return id;
//     }).then(response => {
//       if (response.extensionId !== undefined) return response;
  
//       return response.json();
//     }).then(data => {
//       let extensionId = typeof data === 'object' ? data.extensionId : JSON.parse(data).ExtensionGuid;
//       return setStorage({ 'extensionId': extensionId });
//     }).then(data => {
//       resolve(data.extensionId);
//     }).catch(error => {
//       console.log(error);
//       reject(error);
//     });
//   });
// }

/**
 * @function checkNewArticles
 * sends a request to the server asking for recent unread articles from this extension
 */
// function checkNewArticles() {
//   let extensionGuidPromise = checkRegistration();
//   let lastPollPromise = getStorage('lastPoll');

//   return new Promise((resolve, reject) => {
//     Promise.all([extensionGuidPromise, lastPollPromise]).then(values => {
//       let extensionGuid = values[0];
//       let lastPollDate = new Date(values[1].lastPoll);
//       let now = new Date();
//       let threshold = {
//         unit: 'minute',
//         value: 5 // do not hit API if our previous check was less than 5 minutes ago
//       }
  
//       if (values[1].lastPoll === undefined || timeDiff(lastPollDate, now, threshold)) {
//         let endpoint = ENDPOINTS.CHECK_NEW_ARTICLES;
//         let params = generateCheckArticleApiParams(extensionGuid);
        
//         resolve(apiGet(endpoint, params));
//       } else {
//         reject(false);
//       }
//     });
//   });
// }

// function generateCheckArticleApiParams(extensionGuid) {
//   let params = {};

//   if (extensionGuid !== undefined) {
//     params.extensionGuid = extensionGuid;
//   }

//   return params;
// }

// function setArticleStorage(articleArr) {
//   let prevArticleId;
//   let prevArticleDate = new Date();

//   for (var article of articleArr) {
//     // maintain the oldest articleId returned from the API
//     let articleDate = new Date(article.PublishDate);

//     // add viewed property to the object
//     article.viewed = false;

//     if (articleDate < prevArticleDate) {
//       prevArticleId = article.ArticleId;
//       prevArticleDate = articleDate;
//     }
//   }

//   setStorage({ 'articles': articleArr }).then(() => {
//     updateBadgeTextWithUnreadCount();
//   }).catch(error => {
//     console.log(error);
//   });
//   setStorage({ 'prevArticleId': prevArticleId });
// }

// /**
//  * @function setLatestPollDate
//  * keeps track of the last time we pinged the server for new articles
//  */
// function setLatestPollDate() {
//   let pollDate = new Date().toLocaleString();
//   setStorage({ 'lastPoll': pollDate });
// }