const chai = require('chai');
const moment = require('moment');
const esClient = require('../../../app/lib/esClient');
const utils = require('./../testUtils');

const expect = chai.expect;

// todo: change 'new Date()' to create moment from string for clarity
describe('esClient', function test() {
  this.timeout(utils.maxWaitTimeMs);

  before((done) => {
    utils.waitForSiteReady(done);
  });

  describe('getOpenPharmacies late at night', () => {
    const location = { longitude: -1.46519099452929, latitude: 54.0095586395326 };
    const feb14at10pm = moment(new Date(2017, 1, 14, 22, 0, 0));
    it('should return pharmacies as an array', (done) => {
      esClient.getOpenPharmacies(feb14at10pm, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Boots');
        done();
      }).catch(done);
    });
  });

  describe('getOpenPharmacies daytime', () => {
    const location = { longitude: -0.973733449344135, latitude: 53.9657775613804 };
    const friday2pm = moment(new Date(2017, 8, 29, 14, 0, 0));
    it('should return pharmacies as an array', (done) => {
      esClient.getOpenPharmacies(friday2pm, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Dunnington Pharmacy');
        done();
      }).catch(done);
    });
  });

  describe('getOpenPharmacies daytime 2', () => {
    const location = { longitude: -0.897433791008795, latitude: 54.1592799791386 };
    const friday2pm = moment(new Date(2017, 8, 29, 14, 0, 0));
    it('should return pharmacies as an array', (done) => {
      esClient.getOpenPharmacies(friday2pm, location, 25, 1).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.equal(1);
        expect(pharmacies[0].name).to.equal('LloydsPharmacy');
        done();
      }).catch(done);
    });
  });

  describe('getOpenPharmacies alteration open', () => {
    const location = { longitude: -1.3601, latitude: 50.9778 };
    const friday2pm = moment(new Date(2017, 3, 15, 11, 0, 0));
    it('should return pharmacies as an array', (done) => {
      esClient.getOpenPharmacies(friday2pm, location, 25, 2).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.equal(2);
        expect(pharmacies[0].name).to.equal('Boyatt Pharmacy');
        expect(pharmacies[1].name).to.equal('LloydsPharmacy Inside Sainsbury\'s');
        done();
      }).catch(done);
    });
  });

  describe('getOpenPharmacies alteration closed', () => {
    const location = { longitude: -1.3601, latitude: 50.9778 };
    const friday2pm = moment(new Date(2017, 3, 15, 8, 45, 0));
    it('should return pharmacies as an array', (done) => {
      esClient.getOpenPharmacies(friday2pm, location, 25, 1).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.equal(1);
        expect(pharmacies[0].name).to.equal('Boots');
        done();
      }).catch(done);
    });
  });

  describe('getPharmacies', () => {
    const location = { longitude: -1.46519099452929, latitude: 54.0095586395326 };
    it('should return pharmacies as an array', (done) => {
      esClient.getPharmacies(location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.exist;
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
