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
    throw new Error('ES results.hits.hits undefined');
  }
}

async function getPharmacies(location, radius, size) {
  try {
    const results = await client.search(buildNearestQuery(location, radius, size));
    validateResults(results);
    log.info({
      numberOfResults: results.hits.total, location, radius, size
    }, 'ES results returned from get nearby pharmacies.');
    return mapResults(results);
  } catch (error) {
    log.error({
      location, radius, size, errorMessage: error.message
    });
    throw error;
  }
}

async function getOpenPharmacies(time, location, radius, size) {
  try {
    const results = await client.search(buildNearestOpenQuery(time, location, radius, size));
    validateResults(results);
    log.info({
      numberOfResults: results.hits.total, time, location, radius, size
    }, 'ES results returned from get open pharmacies.');
    return mapResults(results);
  } catch (error) {
    log.error({
      location, radius, size, errorMessage: error.message
    });
    throw error;
  }
}

module.exports = {
  getPharmacies,
  getOpenPharmacies,
};
