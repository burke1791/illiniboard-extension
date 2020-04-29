
const updateBadgeWithUnreadCount = function(unreadCount) {
  if (unreadCount > 9) {
    chrome.browserAction.setBadgeText({text: '9+'});
  } else if (unreadCount > 0) {
    chrome.browserAction.setBadgeText({text: String(unreadCount)});
  } else {
    chrome.browserAction.setBadgeText({text: ''});
  }
}

exports.updateBadgeWithUnreadCount = updateBadgeWithUnreadCount;