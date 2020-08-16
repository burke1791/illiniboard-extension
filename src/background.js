import { updateBadgeTextWithUnreadCount } from './utilities/badge.js';
import { getExtensionId, getNewExtensionId } from './utilities/auth';
import { setStorage, clearStorage } from './utilities/storage';
import { determinePollEligibility } from './utilities/apiService';
import { getLastPollDate, setLatestPollDate } from './utilities/helper';
import { fetchNewArticles, sendArticleViews, purgeViewedArticles, storeNewArticles } from './services/article/article.service.js';

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
      // we need to clear storage before getting a new extensionId because any existing data will be tied to an old Id
      await clearStorage();

      extensionId = await getNewExtensionId();
    }

    let lastPoll = await getLastPollDate();
    let pollFlag = determinePollEligibility(lastPoll);

    // if we've never polled the server or it's been 5 minutes since the last poll
    if (pollFlag) {
      // send "viewed" articleIds to the server
      let viewedArticles = await sendArticleViews(extensionId);
      console.log(viewedArticles);

      /**
       * @todo purge the confirmed "viewed" articles from local chrome storage
       */
      await purgeViewedArticles(viewedArticles);

      // set poll date immediately in order to prevent duplicate calls
      await setLatestPollDate();

      let articles = await fetchNewArticles(extensionId);
      console.log(articles);

      await storeNewArticles(articles);
    }

    await updateBadgeTextWithUnreadCount();
  } catch (error) {
    console.log(error);
  }
}