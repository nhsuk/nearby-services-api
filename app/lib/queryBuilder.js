const esConfig = require('../../config/config').es;

const unit = 'mi';
const minutesInADay = 1440;

function dayOfWeekFromMonday(date) {
  const dayOfWeek = date.getDay() - 1;
  return dayOfWeek > -1 ? dayOfWeek : 6;
}

function timeToMinutesSinceMidnight(date) {
  return (dayOfWeekFromMonday(date) * minutesInADay) + (date.getHours() * 60) + date.getMinutes();
}

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

function getGeoQuery(radius, location) {
  return {
    geo_distance: {
      distance: `${radius}${unit}`,
      'location.coordinates': {
        lon: location.longitude,
        lat: location.latitude
      }
    }
  };
}

function getDailyOpeningTimesFilter(minutesSinceMidnightSunday) {
  return {
    nested: {
      path: 'openingTimesAsOffset',
      query: {
        bool: {
          filter: [
            {
              range: {
                'openingTimesAsOffset.opens': {
                  lte: minutesSinceMidnightSunday
                }
              }
            },
            {
              range: {
                'openingTimesAsOffset.closes': {
                  gte: minutesSinceMidnightSunday
                }
              }
            }
          ]
        }
      }
    }
  };
}

function getSortByLocation(query, location) {
  // eslint-disable-next-line no-param-reassign
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
}

function buildOpenQuery(time, location, radius = 25, size = 4) {
  const openQuery = getBaseQuery(size);
  const minutesSinceMidnight = timeToMinutesSinceMidnight(time);
  openQuery.body.query =
    {
      bool: {
        filter: getDailyOpeningTimesFilter(minutesSinceMidnight),
        must: getGeoQuery(radius, location)
      }
    };
  getSortByLocation(openQuery, location);
  return openQuery;
}

function build(location, radius = 25, size = 2500) {
  const query = getBaseQuery(size);
  query.body.query.bool.filter = getGeoQuery(radius, location);
  getSortByLocation(query, location);
  return query;
}

module.exports = {
  build,
  buildOpenQuery,
};
