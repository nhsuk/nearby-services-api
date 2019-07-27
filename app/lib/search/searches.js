const VError = require('verror').VError;

const log = require('../logger');
const queryBuilder = require('./serviceSearchQueryBuilder');
const queryTypes = require('../constants').queryTypes;
const searchRequest = require('./request');

function mapResults(results) {
  return results.value.map((pharmacy) => {
    // eslint-disable-next-line no-param-reassign
    pharmacy.distanceInMiles = 0; // TODO
    return pharmacy;
  });
}

function validateResults(results) {
  if (!results || !results.value) {
    throw new VError('results.value undefined');
  }
}

async function getPharmacies(location, size) {
  try {
    const query = queryBuilder({ location }, { queryType: queryTypes.nearby, size });
    const results = await searchRequest(query, 'search');
    validateResults(results);
    log.info({
      location, numberOfResults: results['@odata.count'], size,
    }, 'results returned from get nearby pharmacies.');
    return mapResults(results);
  } catch (err) {
    const error = new VError({
      cause: err, info: { location, size },
    });
    log.error({ err: error });
    throw error;
  }
}

async function getOpenPharmacies(datetime, location, size) {
  try {
    const query = queryBuilder(
      { location },
      { datetime, queryType: queryTypes.openNearby, size }
    );
    const results = await searchRequest(query, 'search');
    validateResults(results);
    log.info({
      datetime, location, numberOfResults: results.hits.total, size,
    }, 'ES results returned from get open pharmacies.');
    return mapResults(results);
  } catch (err) {
    const error = new VError({
      cause: err, info: { location, size },
    });
    log.error({ err: error });
    throw error;
  }
}

module.exports = {
  getOpenPharmacies,
  getPharmacies,
};
