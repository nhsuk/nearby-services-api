const moment = require('moment');
const VError = require('verror').VError;
const queryTypes = require('../constants').queryTypes;

function getOpeningTimesFilter(date) {
  const aMoment = moment(date);
  const weekday = aMoment.format('dddd');
  const offsetTime = (aMoment.hours() * 60) + aMoment.minutes();
  const dateString = aMoment.format('MMM D YYYY');

  return `
    OrganisationTypeID eq 'PHA' and
      ( OpeningTimesV2/any(time:
              time/IsOpen
              and time/Weekday eq '${weekday}'
              and time/OpeningTimeType eq 'General'
              and time/OffsetOpeningTime le ${offsetTime}
              and time/OffsetClosingTime ge ${offsetTime})
          and not OpeningTimesV2/any(time:
                  time/OpeningTimeType eq 'Additional'
                  and time/AdditionalOpeningDate eq '${dateString}')
          ) or (
            OpeningTimesV2/any(time:
                    time/IsOpen
                    and time/OpeningTimeType eq 'Additional'
                    and time/OffsetOpeningTime le ${offsetTime}
                    and time/OffsetClosingTime ge ${offsetTime}
                    and time/AdditionalOpeningDate eq '${dateString}')
          )`;
}

function build(searchOrigin, options) {
  let filter;

  switch (options.queryType) {
    case queryTypes.nearby:
      filter = '';
      break;
    case queryTypes.openNearby:
      filter = getOpeningTimesFilter(options.date);
      break;
    default:
      throw new VError(`Unknown queryType: ${options.queryType}`);
  }

  const query = {
    count: true,
    filter,
    orderby: `geo.distance(Geocode, geography'POINT(${searchOrigin.location.lon} ${searchOrigin.location.lat})')`,
    select: 'OrganisationName, Address1, Address2, Address3, City, County, Postcode, Geocode, Contacts, OpeningTimes',
    top: options.size,
  };

  return query;
}

module.exports = build;
