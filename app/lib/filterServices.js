const getDateTime = require('../lib/getDateTime');
const OpeningTimes = require('moment-opening-times');
const getOpeningHoursMessage = require('../lib/getOpeningTimesMessage');
const midnightSpanCorrector = require('../lib/midnightSpanCorrector');
const utils = require('../lib/utils');

function filterServices(results, limits) {
  const openServices = [];
  const now = getDateTime();
  const servicesCount = results.length;
  let openServiceCount = 0;

  for (let serviceCount = 0; serviceCount < servicesCount; serviceCount++) {
    const item = results[serviceCount];
    const openingTimes = item.openingTimes;
    let openingTimesMessage = 'Call for opening times';
    let isOpen = false;

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
    }

    item.openingTimesMessage = openingTimesMessage;
    item.isOpen = isOpen;
    item.distanceInMiles = item.dist;

    if (isOpen && openServiceCount < limits.open) {
      openServiceCount += 1;
      openServices.push(utils.deepClone(item));
    }

    if (openServiceCount >= limits.open && serviceCount >= limits.nearby) {
      break;
    }
  }

  return {
    nearbyServices: results.slice(0, limits.nearby),
    openServices,
  };
}

module.exports = filterServices;
