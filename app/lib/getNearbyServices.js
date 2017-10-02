const log = require('../lib/logger');
const esClient = require('./esClient');
const filterServices = require('./filterServices');
const getDateTime = require('./getDateTime');
const utils = require('../lib/utils');
const VError = require('verror').VError;
const esGetPharmacyHistogram = require('./promHistograms').esGetPharmacy;

async function getNearbyServices(searchCoordinates, limits) {
  let endTimer;
  let pharmacies;

  try {
    endTimer = esGetPharmacyHistogram.startTimer();
    const openPharmacies = await esClient.getOpenPharmacies(
      getDateTime(),
      searchCoordinates,
      limits.searchRadius,
      limits.open
    );
    // add one as there may be a duplicate for the open pharmacy
    const nearbyPharmacies = await esClient.getPharmacies(
      searchCoordinates,
      limits.searchRadius,
      limits.nearby + 1
    );
    // interim solution until filterServices is updated
    pharmacies = utils.deduplicateByKey([...openPharmacies, ...nearbyPharmacies], 'identifier');
  } catch (err) {
    log.error({ err: new VError(err) });
    throw err;
  } finally {
    endTimer();
  }
  return filterServices(pharmacies, limits);
}

module.exports = getNearbyServices;
