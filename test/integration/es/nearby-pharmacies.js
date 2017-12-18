const chai = require('chai');
const esFunctions = require('../../../app/lib/esFunctions');
const utils = require('../../lib/testUtils');

const expect = chai.expect;

describe('esFunctions', function test() {
  this.timeout(utils.maxWaitTimeMs);

  before((done) => {
    utils.waitForSiteReady(done);
  });

  describe('getPharmacies', () => {
    const location = { longitude: -1.46519099452929, latitude: 54.0095586395326 };

    it('should return pharmacies as an array', (done) => {
      esFunctions.getPharmacies(location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.exist;
        done();
      }).catch(done);
    });

    it('should return pharmacies populated with distance from location', (done) => {
      esFunctions.getPharmacies(location).then((pharmacies) => {
        pharmacies.forEach(p => expect(p.distanceInMiles).to.be.greaterThan(0, `Pharmacy ${p.identifier} does not have a distance`));
        done();
      }).catch(done);
    });

    it('reducing the radius should return fewer pharmacies', (done) => {
      // Note: set the number of results limit high so it is not hit and causes a false failing test
      const resultsLimit = 100;
      Promise
        .all([
          esFunctions.getPharmacies(location, 5, resultsLimit),
          esFunctions.getPharmacies(location, 1, resultsLimit)
        ])
        .then((pharmacies) => {
          expect(pharmacies[0].length).to.be.greaterThan(pharmacies[1].length);
          done();
        })
        .catch(done);
    });
  });
});
