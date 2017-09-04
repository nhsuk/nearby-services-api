const chai = require('chai');
const esClient = require('../../app/lib/esClient');

const expect = chai.expect;

describe('esClient', () => {
  describe('getQuery', () => {
    const location = { longitude: -1.46519099452929, latitude: 54.0095586395326 };
    it('should return pharmacies as an array', (done) => {
      esClient.getPharmacies(location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.exist;
        done();
      }).catch(done);
    });
    it('number of results should default to 10', (done) => {
      esClient.getPharmacies(location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.equal(10);
        done();
      }).catch(done);
    });
    it('number of results should be parameterised', (done) => {
      esClient.getPharmacies(location, 10, 7).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.equal(7);
        done();
      }).catch(done);
    });
    it('should return pharmacies populated with distance from location', (done) => {
      esClient.getPharmacies(location).then((pharmacies) => {
        pharmacies.forEach(p => expect(p.dis).to.be.greaterThan(0, `Pharmacy ${p.identifier} does not have a distance`));
        done();
      }).catch(done);
    });
    it('reducing the radius should return fewer pharmacies', (done) => {
      // Note: set the number of results limit high so it is not hit and causes a false failing test
      const resultsLimit = 100;
      Promise
        .all([
          esClient.getPharmacies(location, resultsLimit, 5),
          esClient.getPharmacies(location, resultsLimit, 1)
        ])
        .then((pharmacies) => {
          expect(pharmacies[0].length).to.be.greaterThan(pharmacies[1].length);
          done();
        })
        .catch(done);
    });
  });
});
