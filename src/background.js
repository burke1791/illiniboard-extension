import { updateBadgeTextWithUnreadCount } from './badge.js';
import { setStorage, getStorage } from './storage';
import { generateArticleObj } from './article.js';
import { registerNewExtension } from './utilities/apiService';

chrome.runtime.onInstalled.addListener(options => {
  if (options.reason == 'install') {
    let installDate = new Date();
    setStorage({ 'installDate': installDate.toLocaleString() });
  }

  checkRegistration();
});

chrome.webNavigation.onCompleted.addListener(function() {
  
});

/**
 * @function checkRegistration
 * checks for a guid assigned to this browser extension - if it doesn't exist,
 * then we ask the server for a new one
 */
function checkRegistration() {
  getStorage('extensionId').then(id => {
    console.log('extensionId:');
    console.log(id);
    if (Object.keys(id).length === 0 && id.constructor === Object) {
      return registerNewExtension();
    }
    return null;
  }).then(response => {
    if (response === null) return;

    return response.json();
  }).then(data => {
    if (data === undefined) return;

    console.log('newId: ');
    console.log(data);
    setStorage({ 'extensionId': data.ExtensionGuid });
  }).catch(error => {
    console.log(error);
  });
}

/**
 * @function setLatestPollDate
 * keeps track of the last time we pinged the server for new articles
 */
function setLatestPollDate() {
  let pollDate = new Date().toLocaleString();
  setStorage({ 'lastPoll': pollDate });
}