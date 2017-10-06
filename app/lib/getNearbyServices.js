require('moment-timezone');

const timezone = require('../../config/config').timezone;
const log = require('../lib/logger');
const esClient = require('./esClient');
const addMessages = require('./addMessages');
const getDateTime = require('./getDateTime');
const VError = require('verror').VError;
const esGetNearbyPharmacyHistogram = require('./promHistograms').esGetNearbyPharmacy;
const esGetOpenPharmacyHistogram = require('../lib/promHistograms').esGetOpenPharmacy;
const esGetTotalPharmacyHistogram = require('../lib/promHistograms').esGetTotalPharmacy;

async function getOpenPharmacies(now, searchCoordinates, limits) {
  let openTimer;
  try {
    openTimer = esGetOpenPharmacyHistogram.startTimer();
    const openPharmacies = await esClient.getOpenPharmacies(
      now,
      searchCoordinates,
      limits.searchRadius,
      limits.open
    );
    return openPharmacies;
  } catch (err) {
    log.error({ err: new VError(err) });
    throw err;
  } finally {
    openTimer();
  }
}

async function getNearbyPharmacies(searchCoordinates, limits) {
  let nearbyTimer;
  try {
    nearbyTimer = esGetNearbyPharmacyHistogram.startTimer();
    const nearbyPharmacies = await esClient.getPharmacies(
      searchCoordinates,
      limits.searchRadius,
      limits.nearby
    );
    return nearbyPharmacies;
  } catch (err) {
    log.error({ err: new VError(err) });
    throw err;
  } finally {
    nearbyTimer();
  }
}

async function getNearbyServices(searchCoordinates, limits) {
  let totalTimer;
  try {
    totalTimer = esGetTotalPharmacyHistogram.startTimer();

    const now = getDateTime();
    const nowInTimezone = now.clone().tz(timezone);
    const openPharmacies = await getOpenPharmacies(nowInTimezone, searchCoordinates, limits);
    const nearbyPharmacies = await getNearbyPharmacies(searchCoordinates, limits);
    return {
      nearbyServices: addMessages(nearbyPharmacies, now),
      openServices: addMessages(openPharmacies, now),
    };
  } catch (err) {
    log.error({ err: new VError(err) });
    throw err;
  } finally {
    totalTimer();
  }
}

module.exports = getNearbyServices;
