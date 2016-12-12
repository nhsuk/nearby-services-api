const cache = require('memory-cache');
const chai = require('chai');
const pharmacies = require('../../../app/lib/getPharmacies');
const AssertionError = require('assert').AssertionError;
const moment = require('moment');
const constants = require('../../../app/lib/constants');

delete require.cache[require.resolve('../../../config/loadData')];
process.env.PHARMACY_LIST_PATH = '../test/resources/org-api-responses/pharmacy-list';
const loadData = require('../../../config/loadData');

const expect = chai.expect;

describe('Nearby', () => {
  let geo = [];
  const searchPoint = { latitude: 53.797431921096, longitude: -1.55275457242333 };
  const remoteSearchPoint = { latitude: 49.9126167297363, longitude: -6.30890274047852 };

  describe('happy path', () => {
    before('load data', () => {
      cache.clear();
      // load data into the cache using the load data module as there might be
      // stuff going on in it that we don't want to replicate in the tests
      loadData();
      geo = cache.get('geo');
    });

    after('clear all content from the cache', () => {
      cache.clear();
    });

    it('should return an object with nearby and open services', () => {
      const limits = { searchRadius: 20, open: 1, nearby: 3 };
      const results = pharmacies.nearby(searchPoint, geo, limits);

      expect(results).is.not.equal(undefined);
      expect(results.nearbyServices).is.not.equal(undefined);
      expect(results.openServices).is.not.equal(undefined);
    });

    it('should get the distance of results as requested', () => {
      const nonDefaultSearchRadius = 50;
      let geoMockDist;
      const geoMock = {
        nearBy: (lat, lon, dist) => {
          geoMockDist = dist;
          return [];
        },
      };

      pharmacies.nearby(searchPoint, geoMock, { searchRadius: nonDefaultSearchRadius });

      expect(geoMockDist).to.be.equal(nonDefaultSearchRadius * constants.metersInAMile);
    });

    it('should get the number of unique nearby open services requested, ordered by distance',
      () => {
        const requestedNumberOfOpenResults = 4;
        const results =
          pharmacies
          .nearby(remoteSearchPoint, geo,
                  { open: requestedNumberOfOpenResults,
                    searchRadius: 50 })
          .openServices;

        expect(results.length).to.be.equal(requestedNumberOfOpenResults);

        const identifiers = [];
        let previousDistance = 0;

        results.forEach((result) => {
          const identifier = result.identifier;
          expect(identifiers.includes(identifier))
            .to.be.equal(false, `${identifier} is contained in the list of results already`);
          identifiers.push(identifier);

          expect(result.isOpen).to.be.equal(true);
          expect(result.distanceInMiles).to.be.at.least(previousDistance);
          previousDistance = result.distanceInMiles;
        });
      });

    it('should get the number of unique nearby services requested, ordered by distance', () => {
      const requestedNumberOfResults = 51;
      const results =
        pharmacies
        .nearby(remoteSearchPoint, geo,
                { nearby: requestedNumberOfResults,
                  searchRadius: 50 })
        .nearbyServices;

      expect(results.length).to.be.equal(requestedNumberOfResults);

      const identifiers = [];
      let previousDistance = 0;

      results.forEach((result) => {
        const identifier = result.identifier;
        expect(identifiers.includes(identifier))
          .to.be.equal(false, `${identifier} is contained in the list of results already`);
        identifiers.push(identifier);

        expect(result.distanceInMiles).to.be.at.least(previousDistance);
        previousDistance = result.distanceInMiles;
      });
    });

    it('should return the nearest obj first', () => {
      const limits = { searchRadius: 20, open: 1, nearby: 3 };
      const nearestIdentifier = 'FFP17';

      const results = pharmacies.nearby(searchPoint, geo, limits).nearbyServices;

      expect(results[0].identifier).to.be.equal(nearestIdentifier);
    });

    it('should return the opening times message and open state', () => {
      const alwaysOpenOrg = {
        latitude: searchPoint.latitude,
        longitude: searchPoint.longitude,
        openingTimes: {
          general: {
            monday: [{ opens: '00:00', closes: '23:59' }],
            tuesday: [{ opens: '00:00', closes: '23:59' }],
            wednesday: [{ opens: '00:00', closes: '23:59' }],
            thursday: [{ opens: '00:00', closes: '23:59' }],
            friday: [{ opens: '00:00', closes: '23:59' }],
            saturday: [{ opens: '00:00', closes: '23:59' }],
            sunday: [{ opens: '00:00', closes: '23:59' }],
          },
        },
      };
      function nearbyStub() { return [alwaysOpenOrg]; }
      const oneOpenOrgGeo = { nearBy: nearbyStub };

      const results =
        pharmacies.nearby(searchPoint, oneOpenOrgGeo, { open: 1, nearby: 3 }).openServices;

      expect(results[0].isOpen).to.be.equal(true);
      expect(results[0].openingTimesMessage).to.not.be.equal('Call for opening times');
      expect(results[0].openingTimesMessage).to.be.a('string');
    });

    it('should use alterations opening times', () => {
      const nowDate = moment().format('YYYY-MM-DD');
      const alterations = {};
      alterations[nowDate] = [{ opens: '00:00', closes: '23:59' }];

      const orgWithAlterations = {
        latitude: searchPoint.latitude,
        longitude: searchPoint.longitude,
        openingTimes: {
          general: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          },
          alterations,
        },
      };

      function nearbyStub() { return [orgWithAlterations]; }
      const oneOrgGeo = { nearBy: nearbyStub };

      const results =
        pharmacies.nearby(searchPoint, oneOrgGeo, { open: 1, nearby: 3 }).openServices;

      expect(results[0].isOpen).to.be.equal(true);
      expect(results[0].openingTimesMessage).to.not.be.equal('Call for opening times');
      expect(results[0].openingTimesMessage).to.be.a('string');
    });

    it('should say call for opening times when the org does not have any opening times', () => {
      const orgWithNoOpeningTimes = {
        latitude: searchPoint.latitude,
        longitude: searchPoint.longitude,
      };
      function nearbyStub() { return [orgWithNoOpeningTimes]; }
      const oneOrgGeo = { nearBy: nearbyStub };

      const results =
        pharmacies.nearby(searchPoint, oneOrgGeo, { searchRadius: 20 }).nearbyServices;

      expect(results.length).to.be.equal(1);
      expect(results[0].isOpen).to.be.equal(false);
      expect(results[0].openingTimesMessage).to.be.equal('Call for opening times');
    });
  });

  describe('error handling', () => {
    it('should throw an exception when geo is null', () => {
      expect(() => { pharmacies.nearby({ latitude: 50.01, longitude: -1.23 }); })
        .to.throw(AssertionError, 'geo can not be null');
    });

    it('should throw an exception when geo does not contain a nearby function', () => {
      expect(() => { pharmacies.nearby({ latitude: 50.01, longitude: -1.23 }, {}); })
        .to.throw(AssertionError, 'geo must contain a nearBy function');
    });
  });
});
