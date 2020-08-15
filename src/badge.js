
import { getStorage } from './utilities/storage';
import { getUnreadArticleCount } from './utilities/helper';

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
  chrome.browserAction.setBadgeText({text: text});
}

const updateBadgeTextWithUnreadCount = () => {
  let unreadCount = 0;

  getStorage('articles').then(data => {
    unreadCount = getUnreadArticleCount(data.articles);

    updateBadgeText(getUnreadCountBadgeText(unreadCount));
  });
}

export {
  updateBadgeTextWithUnreadCount,
  getUnreadCountBadgeText
};