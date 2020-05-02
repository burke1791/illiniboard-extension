
const getUnreadCountBadgeText = function(unreadCount) {
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

const updateBadgeTextWithUnreadCount = (unreadCount) => {
  let badgeText = getUnreadCountBadgeText(unreadCount);
  updateBadgeText(badgeText);
}

export {
  updateBadgeTextWithUnreadCount
};