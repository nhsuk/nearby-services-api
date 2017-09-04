const log = require('../../app/lib/logger');
const esClient = require('./esClient');
const filterServices = require('./filterServices');
const VError = require('verror').VError;

function getNearbyServices(searchCoordinates, limits, next) {
  esClient
    .getPharmacies(searchCoordinates, limits.searchRadius)
    .then((pharmacies) => {
      const filteredServices = filterServices(pharmacies, limits);
      next(null, filteredServices);
    })
    .catch((err) => {
      log.error({ err: new VError(err) });
    });
}

module.exports = getNearbyServices;
