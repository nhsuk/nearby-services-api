const getDateTime = require('../lib/getDateTime');
const OpeningTimes = require('moment-opening-times');
const getOpeningHoursMessage = require('../lib/getOpeningTimesMessage');
const midnightSpanCorrector = require('../lib/midnightSpanCorrector');
const utils = require('../lib/utils');
const filterServicesHistogram = require('../lib/promHistograms').filterServices;

function filterServices(sortedServices, limits) {
  const endTimer = filterServicesHistogram.startTimer();
  const openServices = [];
  const nearbyServices = [];

  const now = getDateTime();

  for (let i = 0; i < sortedServices.length; i++) {
    const item = sortedServices[i];
    const openingTimes = item.openingTimes;
    let openingTimesMessage = 'Call for opening times';
    let isOpen = false;

    if (openingTimes) {
      const openingTimesMoment =
        new OpeningTimes(
          item.openingTimes.general,
          'Europe/London',
          item.openingTimes.alterations
        );

      let status = openingTimesMoment.getStatus(now, { next: true });
      status = midnightSpanCorrector(openingTimesMoment, status);
      openingTimesMessage = getOpeningHoursMessage(status);
      isOpen = status.isOpen;
    }

    item.openingTimesMessage = openingTimesMessage;
    item.isOpen = isOpen;
    item.distanceInMiles = sortedServices[i].dis;

    if (nearbyServices.length < limits.nearby) {
      nearbyServices.push(utils.deepClone(item));
    }

    if (isOpen && openServices.length < limits.open) {
      openServices.push(utils.deepClone(item));
    }

    if (openServices.length >= limits.open && nearbyServices.length >= limits.nearby) {
      break;
    }
  }

  endTimer();
  return {
    nearbyServices,
    openServices,
  };
}

module.exports = filterServices;
