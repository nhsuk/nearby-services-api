const esConfig = require('../../config/config').es;

const unit = 'mi';

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

function build(location, radius = 25, size = 2500) {
  const query = getBaseQuery(size);

  query.body.query.bool.filter = {
    geo_distance: {
      distance: `${radius}${unit}`,
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
        unit,
        distance_type: 'arc'
      }
    }
  ];

  return query;
}

module.exports = build;
