const chai = require('chai');
const VError = require('verror').VError;

const constants = require('../../../../app/lib/constants');
const queryBuilder = require('../../../../app/lib/search/serviceSearchQueryBuilder');

const expect = chai.expect;

describe('queryBuilder', () => {
  it('should return nearby query when the query type is nearby', () => {
    const searchOrigin = { location: { lat: 54.12, lon: -1.55 } };
    const queryType = constants.queryTypes.nearby;
    const size = 10;

    const output = queryBuilder(searchOrigin, { queryType, size });

    expect(output).to.be.an('object');
    expect(output).to.have.property('count').and.equal(true);
    expect(output).to.have.property('filter').and.equal('');
    expect(output).to.have.property('orderby').and.equal(`geo.distance(Geocode, geography'POINT(${searchOrigin.location.lon} ${searchOrigin.location.lat})')`);
    expect(output).to.have.property('select').and.equal('OrganisationName, Address1, Address2, Address3, City, County, Postcode, Geocode, Contacts, OpeningTimes');
    expect(output).to.have.property('top').and.equal(size);
  });

  it('should return open nearby query when the query type is openNearby', () => {
    const searchOrigin = { location: { lat: 54.12, lon: -1.55 } };
    const queryType = constants.queryTypes.openNearby;
    const size = 10;
    const datetime = new Date('July 26, 19 07:20');
    const expectedFilter = `
    OrganisationTypeID eq 'PHA' and
      ( OpeningTimesV2/any(time:
              time/IsOpen
              and time/Weekday eq 'Friday'
              and time/OpeningTimeType eq 'General'
              and time/OffsetOpeningTime le 440
              and time/OffsetClosingTime ge 440)
          and not OpeningTimesV2/any(time:
                  time/OpeningTimeType eq 'Additional'
                  and time/AdditionalOpeningDate eq 'Jul 26 2019')
          ) or (
            OpeningTimesV2/any(time:
                    time/IsOpen
                    and time/OpeningTimeType eq 'Additional'
                    and time/OffsetOpeningTime le 440
                    and time/OffsetClosingTime ge 440
                    and time/AdditionalOpeningDate eq 'Jul 26 2019')
          )`;

    const output = queryBuilder(searchOrigin, { datetime, queryType, size });

    expect(output).to.be.an('object');
    expect(output).to.have.property('count').and.equal(true);
    expect(output).to.have.property('filter').and.equal(expectedFilter);
    expect(output).to.have.property('orderby').and.equal(`geo.distance(Geocode, geography'POINT(${searchOrigin.location.lon} ${searchOrigin.location.lat})')`);
    expect(output).to.have.property('select').and.equal('OrganisationName, Address1, Address2, Address3, City, County, Postcode, Geocode, Contacts, OpeningTimes');
    expect(output).to.have.property('top').and.equal(size);
  });

  describe('unknown type', () => {
    it('should throw VError', () => {
      const queryType = 'unknown';
      expect(() => queryBuilder({}, { queryType })).to.throw(VError, `Unknown queryType: ${queryType}`);
    });
  });
});
