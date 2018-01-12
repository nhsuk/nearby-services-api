const esConfig = require('../../config/config').es;

const unit = 'mi';
const minutesInADay = 1440;

function dayOfWeekFromMonday(moment) {
  const dayOfWeek = moment.day() - 1;
  return dayOfWeek > -1 ? dayOfWeek : 6;
}

function timeToMinutesSinceMidnightMonday(moment) {
  return (dayOfWeekFromMonday(moment) * minutesInADay) + (moment.hours() * 60) + moment.minutes();
}

function timeToMinutesSinceMidnight(moment) {
  return (moment.hours() * 60) + moment.minutes();
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

function getAlterationsDayQuery(dateString) {
  return {
    nested: {
      path: 'openingTimesAlterationsAsOffset',
      query: {
        bool: {
          filter: [
            { range: { 'openingTimesAlterationsAsOffset.date': { lte: dateString } } },
            { range: { 'openingTimesAlterationsAsOffset.date': { gte: dateString } } }
          ]
        }
      }
    }
  };
}

function getAlterationsDayTimeQuery(dateString, minutesSinceMidnight) {
  return {
    nested: {
      path: 'openingTimesAlterationsAsOffset',
      query: {
        bool: {
          filter: [
            { range: { 'openingTimesAlterationsAsOffset.date': { lte: dateString } } },
            { range: { 'openingTimesAlterationsAsOffset.date': { gte: dateString } } },
            { range: { 'openingTimesAlterationsAsOffset.opens': { lte: minutesSinceMidnight } } },
            { range: { 'openingTimesAlterationsAsOffset.closes': { gte: minutesSinceMidnight } } }
          ]
        }
      }
    }
  };
}

function getDailyOpeningTimesQuery(minutesSinceMidnightSunday) {
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

function getSortByLocation(location) {
  return [
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

function getOpenAndNearestQuery(moment) {
  const minutesSinceMidnightMonday = timeToMinutesSinceMidnightMonday(moment);
  const minutesSinceMidnight = timeToMinutesSinceMidnight(moment);
  const dateString = moment.format('YYYY-MM-DD');
  return {
    constant_score: {
      filter: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        getDailyOpeningTimesQuery(minutesSinceMidnightMonday)
                      ],
                      must_not: [
                        getAlterationsDayQuery(dateString)
                      ]
                    }
                  },
                  {
                    bool: {
                      must: [getAlterationsDayTimeQuery(dateString, minutesSinceMidnight)]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  };
}

function buildNearestOpenQuery(moment, location, size) {
  const openQuery = getBaseQuery(size);
  openQuery.body.query = getOpenAndNearestQuery(moment, location);
  openQuery.body.sort = getSortByLocation(location);
  return openQuery;
}

function buildNearestQuery(location, size) {
  const query = getBaseQuery(size);
  query.body.sort = getSortByLocation(location);
  return query;
}

module.exports = {
  buildNearestQuery,
  buildNearestOpenQuery,
};
