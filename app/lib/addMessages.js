const getDateTime = require('../lib/getDateTime');
const OpeningTimes = require('moment-opening-times');
const getOpeningHoursMessage = require('../lib/getOpeningTimesMessage');
const midnightSpanCorrector = require('../lib/midnightSpanCorrector');

function getOpeningInfo(openingTimes, now) {
  const openingTimesMoment = new OpeningTimes(openingTimes.general, 'Europe/London', openingTimes.alterations);
  let status = openingTimesMoment.getStatus(now, { next: true });
  status = midnightSpanCorrector(openingTimesMoment, status);
  return {
    openingTimesMessage: getOpeningHoursMessage(status),
    isOpen: status.isOpen
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
  /* eslint-enable */
  return item;
}

function addMessages(services) {
  const now = getDateTime();
  return services.map(service => addMessage(service, now));
}

module.exports = addMessages;
