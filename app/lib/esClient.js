const log = require('./logger');
const elasticsearch = require('elasticsearch');
const esConfig = require('../../config/config').es;

const client = elasticsearch.Client({ host: `${esConfig.host}:${esConfig.port}` });

function getBaseQuery(size) {
  return {
    index: esConfig.index,
    type: 'pharmacy',
    body: {
      size,
      query: {
        bool: {}
      }
    }
  };
}

function build(location, radius, size) {
  const query = getBaseQuery(size);

  query.body.query.bool.filter = {
    geo_distance: {
      distance: `${radius}mi`,
      'location.coordinates': {
        lon: location.longitude,
        lat: location.latitude
      }
    }
  };

  query.body.sort = [
    {
      _geo_distance: {
        'location.coordinates': {
          lon: location.longitude,
          lat: location.latitude
        },
        order: 'asc',
        unit: 'mi',
        distance_type: 'plane'
      }
    }
  ];

  return query;
}

function mapResults(results) {
  return results.hits.hits.map((hit) => {
    // eslint-disable-next-line no-underscore-dangle
    const pharmacy = hit._source;
    pharmacy.dis = hit.sort[0];
    return pharmacy;
  });
}
async function getPharmacies(location, radius = 25, size = 2500) {
  try {
    const results = await client.search(build(location, radius, size));
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
  getHealth,
};
