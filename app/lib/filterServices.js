const getDateTime = require('../lib/getDateTime');
const OpeningTimes = require('moment-opening-times');
const getOpeningHoursMessage = require('../lib/getOpeningTimesMessage');
const midnightSpanCorrector = require('../lib/midnightSpanCorrector');
const utils = require('../lib/utils');

function sortByDistance(a, b) {
  return a.dist - b.dist;
}

function filterServices(results, limits) {
  const openServices = [];
  let serviceCount = 0;
  let openServiceCount = 0;

  const sortedServices = results.sort(sortByDistance);
  const now = getDateTime();

  for (let i = 0; i < sortedServices.length; i++) {
    const item = sortedServices[i];
    const openingTimes = item.openingTimes;
    let isOpen;
    let openingTimesMessage;

    if (openingTimes) {
      const openingTimesMoment =
        new OpeningTimes(
          item.openingTimes.general,
          'Europe/London',
          item.openingTimes.alterations);

      let status = openingTimesMoment.getStatus(now, { next: true });
      status = midnightSpanCorrector(openingTimesMoment, status);
      openingTimesMessage = getOpeningHoursMessage(status);
      isOpen = status.isOpen;
    } else {
      openingTimesMessage = 'Call for opening times';
      isOpen = false;
    }

    item.openingTimesMessage = openingTimesMessage;
    item.isOpen = isOpen;
    item.distanceInMiles = item.dist;

    if (isOpen && openServiceCount < limits.open) {
      openServiceCount += 1;
      openServices.push(utils.deepClone(item));
    }

    serviceCount += 1;

    if (openServiceCount >= limits.open && serviceCount >= limits.nearby) {
      break;
    }
  }

  return {
    nearbyServices: sortedServices.slice(0, limits.nearby),
    openServices,
  };
}

module.exports = filterServices;
