
import { getStorage } from './storage';

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

  getStorage(null).then(items => {
    let lastView = items['lastView'];

    if (lastView != null) {
      let lastViewDate = new Date(lastView);

      unreadCount = getUnreadArticleCount(items, lastViewDate);

      updateBadgeText(getUnreadCountBadgeText(unreadCount));
    }
  });
}

export {
  updateBadgeTextWithUnreadCount,
  getUnreadCountBadgeText
};