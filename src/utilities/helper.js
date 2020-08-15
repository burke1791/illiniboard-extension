
export function getUnreadArticleCount(articles) {
  let unreadCount = 0;

  for (var key in articles) {
    let article = articles[key];
    if (!article.viewed && article.viewed !== undefined) unreadCount++;
  }

  return unreadCount;
}

/**
 * @function timeDiff - Returns true if the difference between date1 and date2 is larger than the threshold; false otherwise
 * @param {Date} date1 
 * @param {Date} date2 
 * @param {object} threshold
 * @param {string} threshold.unit - string indicating threshold's units, e.g. "minute", "second", etc.
 * @param {number} threshold.value
 */
export function timeDiff(date1, date2, threshold) {
  // check if the inputs are date objects - not foolproof, but good enough for now
  if (date1 instanceof Date && date2 instanceof Date) {
    let date1ms = date1.valueOf();
    let date2ms = date2.valueOf();

    let diff = calculateDiff(date1ms, date2ms, threshold.unit);

    return (diff - threshold.value) > 0;
  } else {
    throw new Error('date1 and/or date2 are not Date objects');
  }
}

/**
 * @function calculateDiff - Returns the difference in the supplied unit between the two time inputs
 * @param {number} time1 - ms since unix epoch
 * @param {number} time2 - ms since unix epoch
 * @param {string} unit - "minute", "second", etc.
 */
function calculateDiff(time1, time2, unit) {
  switch (unit) {
    case 'second':
      return Math.abs((time1 - time2) / 1000);
    case 'minute':
      return Math.abs((time1 - time2) / 1000 / 60);
    default:
      throw new Error('valid unit not supplied');
  }
}

export function generateQueryString(params) {
  let keys = Object.keys(params);

  let queryString = '';

  for (var i in keys) {
    if (i == 0) {
      queryString += `?${keys[i]}=${params[keys[i]]}`
    } else {
      queryString += `&${keys[i]}=${params[keys[i]]}`
    }
  }

  return queryString;
}