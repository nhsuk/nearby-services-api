const chai = require('chai');
const filterServices = require('../../../app/lib/filterServices');
// const AssertionError = require('assert').AssertionError;
const moment = require('moment');

const expect = chai.expect;

describe('filterServices', () => {
  describe('happy path', () => {
    const alwaysOpenOrg = {
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

    it('should return empty nearby and open services when no there are no results to be filtered', () => {
      const limits = { open: 1, nearby: 3 };
      const results = filterServices([], limits);

      /* eslint-disable no-unused-expressions */
      expect(results).to.have.property('nearbyServices').that.is.an('array').to.be.empty;
      expect(results).to.have.property('openServices').that.is.an('array').to.be.empty;
      /* eslint-enable no-unused-expressions */
    });

    // TODO: Tests for:
    // - isOpen property
    // - openingTimesMessage property

    it('should return the number of nearby results requested when there are more than requested, ordered by distance',
      () => {
        const toFilter = [
          {},
          {},
        ];
        const requestedNumberOfOpenResults = 1;
        const results =
          filterServices(toFilter, { nearby: requestedNumberOfOpenResults });

        expect(results.nearbyServices.length).to.be.equal(requestedNumberOfOpenResults);
      });

    it('should return an open service, when there is one', () => {
      const limits = { nearby: 1, open: 1 };
      const toFilter = [alwaysOpenOrg];

      const results = filterServices(toFilter, limits);

      expect(results.openServices.length).to.be.equal(1);
    });

    it('should return an open service as both open and nearby', () => {
      const limits = { nearby: 1, open: 1 };
      const toFilter = [alwaysOpenOrg];

      const results = filterServices(toFilter, limits);

      expect(results.openServices.length).to.be.equal(1);
      expect(results.nearbyServices.length).to.be.equal(1);
    });

    it('should return the nearest obj first', () => {
      const limits = { nearby: 3, open: 1 };
      const toFilter = [
        { distanceInMiles: 2, identifier: 'A' },
        { distanceInMiles: 1, identifier: 'B' },
      ];

      const results = filterServices(toFilter, limits);
      const nearbyServices = results.nearbyServices;

      expect(nearbyServices.length).to.be.equal(toFilter.length);
      expect(nearbyServices[0].identifier).to.be.equal('B');
      expect(nearbyServices[1].identifier).to.be.equal('A');
    });

    it('should return the opening times message and open state', () => {
      const limits = { nearby: 1, open: 1 };
      const toFilter = [alwaysOpenOrg];

      const results = filterServices(toFilter, limits);
      const openServices = results.openServices;

      expect(openServices.length).to.be.equal(1);
      expect(openServices[0].isOpen).to.be.equal(true);
      expect(openServices[0].openingTimesMessage).to.be.equal('Open until midnight');
    });

    it('should use alterations opening times', () => {
      const nowDate = moment().format('YYYY-MM-DD');
      const alterations = {};
      alterations[nowDate] = [{ opens: '00:00', closes: '23:59' }];

      const orgWithAlterations = {
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

      const toFilter = [orgWithAlterations];

      const results = filterServices(toFilter, { open: 1, nearby: 1 });
      const openServices = results.openServices;

      expect(openServices[0].isOpen).to.be.equal(true);
      expect(openServices[0].openingTimesMessage).to.be.equal('Open until midnight');
    });

    it('should say call for opening times when the org does not have any opening times', () => {
      const limits = { nearby: 1, open: 1 };
      const toFilter = [{}];

      const results = filterServices(toFilter, limits);
      const nearbyServices = results.nearbyServices;

      expect(nearbyServices.length).to.be.equal(1);
      expect(nearbyServices[0].isOpen).to.be.equal(false);
      expect(nearbyServices[0].openingTimesMessage).to.be.equal('Call for opening times');
    });
  });
});
