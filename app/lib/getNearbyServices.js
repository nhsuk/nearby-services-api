const log = require('../../app/lib/logger');
const esClient = require('./esClient');
const filterServices = require('./filterServices');
const VError = require('verror').VError;

async function getNearbyServices(searchCoordinates, limits) {
  try {
    const pharmacies = await esClient.getPharmacies(searchCoordinates, limits.searchRadius);
    return filterServices(pharmacies, limits);
  } catch (err) {
    log.error({ err: new VError(err) });
    throw err;
  }
}

module.exports = getNearbyServices;
