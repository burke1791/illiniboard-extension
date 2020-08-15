
import { getStorage } from './storage';
import { getUnreadArticleCount } from './helper';

const getUnreadCountBadgeText = (unreadCount) => {
  let badgeText = '';

  if (unreadCount > 9) {
    badgeText = '9+'
  } else if (unreadCount > 0) {
    badgeText = String(unreadCount);
  }

  return badgeText;
}

const updateBadgeText = (text) => {
  return new Promise((resolve, reject) => {
    chrome.browserAction.setBadgeText({text: text}, () => {
      // text set correctly
      resolve(true);
    });
  });
}

const updateBadgeTextWithUnreadCount = () => {
  let unreadCount = 0;

  return new Promise((resolve, reject) => {
    getStorage('articles').then(data => {
      unreadCount = getUnreadArticleCount(data.articles);
      console.log(unreadCount);
      return updateBadgeText(getUnreadCountBadgeText(unreadCount));
    }).then(result => {
      console.log(result);
      resolve(result);
    });
  });
}

export {
  updateBadgeTextWithUnreadCount,
  getUnreadCountBadgeText
};