const OpeningTimes = require('moment-opening-times');

const timezone = require('../../config/config').timezone;
const getOpeningHoursMessage = require('../lib/getOpeningTimesMessage');
const midnightSpanCorrector = require('../lib/midnightSpanCorrector');
const getOpeningTimesOverview = require('../lib/getOpeningTimesOverview');

function getOpeningInfo(openingTimes, now) {
  const openingTimesMoment = new OpeningTimes(
    openingTimes.general,
    timezone,
    openingTimes.alterations
  );
  let status = openingTimesMoment.getStatus(now, { next: true });
  status = midnightSpanCorrector(openingTimesMoment, status);
  return {
    openingTimesMessage: getOpeningHoursMessage(status),
    isOpen: status.isOpen,
    nextOpen: status.nextOpen,
  };
}

function getDefault() {
  return {
    openingTimesMessage: 'Call for opening times',
    isOpen: false,
  };
}

function addMessage(item, now) {
  const openingInfo = item.openingTimes ? getOpeningInfo(item.openingTimes, now) : getDefault();
  /* eslint-disable no-param-reassign */
  item.openingTimesMessage = openingInfo.openingTimesMessage;
  item.isOpen = openingInfo.isOpen;
  item.nextOpen = openingInfo.nextOpen;
  if (item.openingTimes && item.openingTimes.general) {
    item.openingTimesOverview = getOpeningTimesOverview(item.openingTimes.general);
  }
  /* eslint-enable */
  return item;
}

function addMessages(services, now) {
  return services.map(service => addMessage(service, now));
}

module.exports = addMessages;
