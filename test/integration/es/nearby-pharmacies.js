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

    it('should return the number of pharmacies as per request', (done) => {
      const resultsRequested = 13;
      esFunctions.getPharmacies(location, resultsRequested).then((pharmacies) => {
        expect(pharmacies.length).to.equal(resultsRequested);
        done();
      }).catch(done);
    });
  });
});
