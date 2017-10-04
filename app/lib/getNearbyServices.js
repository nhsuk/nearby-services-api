const log = require('../lib/logger');
const esClient = require('./esClient');
const addMessages = require('./addMessages');
const getDateTime = require('./getDateTime');
const VError = require('verror').VError;
const esGetPharmacyHistogram = require('./promHistograms').esGetPharmacy;
const filterServicesHistogram = require('../lib/promHistograms').filterServices;

async function getNearbyServices(searchCoordinates, limits) {
  let endTimer;
  let nearbyPharmacies;
  let openPharmacies;

  try {
    endTimer = esGetPharmacyHistogram.startTimer();
    openPharmacies = await esClient.getOpenPharmacies(
      getDateTime(),
      searchCoordinates,
      limits.searchRadius,
      limits.open
    );
    nearbyPharmacies = await esClient.getPharmacies(
      searchCoordinates,
      limits.searchRadius,
      limits.nearby
    );
  } catch (err) {
    log.error({ err: new VError(err) });
    throw err;
  } finally {
    endTimer();
  }

  const fiterTimer = filterServicesHistogram.startTimer();
  const results = {
    nearbyServices: addMessages(nearbyPharmacies),
    openServices: addMessages(openPharmacies),
  };
  fiterTimer();
  return results;
}

module.exports = getNearbyServices;
