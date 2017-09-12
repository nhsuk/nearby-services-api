const log = require('../../app/lib/logger');
const esClient = require('./esClient');
const filterServices = require('./filterServices');
const VError = require('verror').VError;
const esGetPharmacyHistogram = require('./promHistograms').esGetPharmacy;

async function getNearbyServices(searchCoordinates, limits) {
  let endTimer;
  let pharmacies;

  try {
    endTimer = esGetPharmacyHistogram.startTimer();
    pharmacies = await esClient.getPharmacies(searchCoordinates, limits.searchRadius);
  } catch (err) {
    log.error({ err: new VError(err) });
    throw err;
  } finally {
    endTimer();
  }
  return filterServices(pharmacies, limits);
}

module.exports = getNearbyServices;
