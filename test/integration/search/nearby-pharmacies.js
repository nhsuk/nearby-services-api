const chai = require('chai');
const searches = require('../../../app/lib/search/searches');
const utils = require('../../lib/testUtils');

const expect = chai.expect;

describe('searches', function test() {
  this.timeout(utils.maxWaitTimeMs);

  describe('getPharmacies', () => {
    const location = { lat: 54.0095586395326, lon: -1.46519099452929 };

    it('should return pharmacies as an array', (done) => {
      searches.getPharmacies(location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].OrganisationName).to.exist;
        done();
      }).catch(done);
    });

    it('should return the number of pharmacies as per request', (done) => {
      const resultsRequested = 13;
      searches.getPharmacies(location, resultsRequested).then((pharmacies) => {
        expect(pharmacies.length).to.equal(resultsRequested);
        done();
      }).catch(done);
    });
  });
});
