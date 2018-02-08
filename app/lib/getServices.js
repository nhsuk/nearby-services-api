require('moment-timezone');

const VError = require('verror').VError;

const addMessages = require('./addMessages');
const esFunctions = require('./esFunctions');
const esGetNearbyPharmacyHistogram = require('./promHistograms').esGetNearbyPharmacy;
const esGetOpenPharmacyHistogram = require('./promHistograms').esGetOpenPharmacy;
const esGetTotalPharmacyHistogram = require('./promHistograms').esGetTotalPharmacy;
const getDateTime = require('./getDateTime');
const log = require('../lib/logger');
const timezone = require('../../config/config').timezone;

async function getServices(searchCoordinates, limits, type) {
  let pharmacies;
  let totalTimer;
  let timer;
  try {
    totalTimer = esGetTotalPharmacyHistogram.startTimer();
    const now = getDateTime().clone().tz(timezone);

    if (type === 'open') {
      timer = esGetOpenPharmacyHistogram.startTimer();
      pharmacies = await esFunctions.getOpenPharmacies(
        now,
        searchCoordinates,
        limits
      );
    } else {
      timer = esGetNearbyPharmacyHistogram.startTimer();
      pharmacies = await esFunctions.getPharmacies(
        searchCoordinates,
        limits
      );
    }

    return addMessages(pharmacies, now);
  } catch (err) {
    const error = new VError(err);
    log.error({ err: error });
    throw error;
  } finally {
    timer();
    totalTimer();
  }
}

function getNearbyServices(searchCoordinates, limits) {
  return getServices(searchCoordinates, limits, 'nearby');
}

function getOpenServices(searchCoordinates, limits) {
  return getServices(searchCoordinates, limits, 'open');
}

module.exports = {
  nearby: getNearbyServices,
  open: getOpenServices,
};
