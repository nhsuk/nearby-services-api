const log = require('../../app/lib/logger');
const docDBClient = require('../lib/docDBClient');
const docDB = require('../../config/config').docDB;
const queries = require('../lib/queries');
const filterServices = require('../lib/filterServices');

function nearby(searchPoint, limits, next) {
  const geoSpatialQuery = queries.geoSpatialQuery(searchPoint, limits.searchRadius);

  docDBClient
    .queryDocuments(docDB.collectionUrl, geoSpatialQuery)
    .toArray((err, results) => {
      if (err) {
        log.error({ err }, 'DocumentDB query failed');
        next(err);
      } else {
        log.debug(`${results.length} RESULTS returned...`);

        log.debug('filter-and-sort-services-start');
        const filteredServices = filterServices(results, limits);
        log.debug('filter-and-sort-services-end');

        next(null, filteredServices);
      }
    });
}

module.exports = {
  nearby,
};
