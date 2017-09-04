const log = require('./logger');
const elasticsearch = require('elasticsearch');
const esConfig = require('../../config/config').es;

const client = elasticsearch.Client({ host: `${esConfig.host}:${esConfig.port}` });

function getBaseQuery(size) {
  return {
    index: 'pharmacies',
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

function getPharmacies(location, radius = 25, size = 10) {
  return client
    .search(build(location, radius, size))
    .then((results) => {
      log.info({
        numberOfResults: results.hits.total, location, radius, size
      }, 'ES results returned.');
      return results.hits.hits.map((hit) => {
        // eslint-disable-next-line no-underscore-dangle 
        const pharmacy = hit._source;
        pharmacy.dis = hit.sort[0];
        return pharmacy;
      });
    })
    .catch(error => log.error({ location, radius, size, errorMessage: error.message }));
}

function getHealth() {
  return new Promise((resolve, reject) => {
    client.cat.health({ format: 'json' }, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
}

module.exports = {
  getPharmacies,
  getHealth,
};
