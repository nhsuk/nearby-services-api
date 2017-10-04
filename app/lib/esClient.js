const log = require('./logger');
const elasticsearch = require('elasticsearch');
const esConfig = require('../../config/config').es;
const buildNearestQuery = require('./queryBuilder').buildNearestQuery;
const buildNearestOpenQuery = require('./queryBuilder').buildNearestOpenQuery;

const client = elasticsearch.Client({ host: `${esConfig.host}:${esConfig.port}` });

function mapResults(results) {
  return results.hits.hits.map((hit) => {
    // eslint-disable-next-line no-underscore-dangle
    const pharmacy = hit._source;
    pharmacy.distanceInMiles = hit.sort[0];
    return pharmacy;
  });
}

async function getPharmacies(location, radius, size) {
  try {
    const results = await client.search(buildNearestQuery(location, radius, size));
    log.info({
      numberOfResults: results.hits.total, location, radius, size
    }, 'ES results returned.');
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
    log.info({
      numberOfResults: results.hits.total, location, radius, size
    }, 'ES results returned.');
    return mapResults(results);
  } catch (error) {
    log.error({
      location, radius, size, errorMessage: error.message
    });
    throw error;
  }
}

function getHealth() {
  return client.cat.health({ format: 'json' });
}

module.exports = {
  getPharmacies,
  getOpenPharmacies,
  getHealth,
};
