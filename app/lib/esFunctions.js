const VError = require('verror').VError;

const buildNearestQuery = require('./queryBuilder').buildNearestQuery;
const buildNearestOpenQuery = require('./queryBuilder').buildNearestOpenQuery;
const client = require('./esClient').client;
const log = require('./logger');

function mapResults(results) {
  return results.hits.hits.map((hit) => {
    // eslint-disable-next-line no-underscore-dangle
    const pharmacy = hit._source;
    pharmacy.distanceInMiles = hit.sort[0];
    return pharmacy;
  });
}

function validateResults(results) {
  if (!results || !results.hits || !results.hits.hits) {
    throw new VError('ES results.hits.hits undefined');
  }
}

async function getPharmacies(location, size) {
  try {
    const results = await client.search(buildNearestQuery(location, size));
    validateResults(results);
    log.info({
      numberOfResults: results.hits.total, location, size
    }, 'ES results returned from get nearby pharmacies.');
    return mapResults(results);
  } catch (err) {
    const error = new VError({
      cause: err, info: { location, size }
    });
    log.error({ err: error });
    throw error;
  }
}

async function getOpenPharmacies(time, location, size) {
  try {
    const results = await client.search(buildNearestOpenQuery(time, location, size));
    validateResults(results);
    log.info({
      numberOfResults: results.hits.total, time, location, size
    }, 'ES results returned from get open pharmacies.');
    return mapResults(results);
  } catch (err) {
    const error = new VError({
      cause: err, info: { location, size }
    });
    log.error({ err: error });
    throw error;
  }
}

module.exports = {
  getPharmacies,
  getOpenPharmacies,
};
