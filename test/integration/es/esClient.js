const chai = require('chai');
const moment = require('moment');
const esClient = require('../../../app/lib/esClient');
const utils = require('./../testUtils');

const expect = chai.expect;

describe('esClient', function test() {
  this.timeout(utils.maxWaitTimeMs);

  before((done) => {
    utils.waitForSiteReady(done);
  });

  describe('getOpenPharmacies', () => {
    it('should return open pharmacies rather than closest closed pharmacy', (done) => {
      const location = { longitude: -1.46519099452929, latitude: 54.0095586395326 };
      const feb14at10pm = moment('2017-02-14 22:00:00');
      esClient.getOpenPharmacies(feb14at10pm, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Boots');
        done();
      }).catch(done);
    });
    it('should return open if closes Friday 23:59 and re-opens Saturday at 00:00', (done) => {
      const location = { longitude: -1.485343, latitude: 53.355021 };
      const fri13at2359 = moment('2017-10-13 23:59:30');
      esClient.getOpenPharmacies(fri13at2359, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Abbeydale Pharmacy');
        done();
      }).catch(done);
    });
    it('should return open if closes Sunday 23:59 and reopens Monday at 00:00', (done) => {
      const location = { longitude: -1.568446, latitude: 53.805765 };
      const fri13at2359 = moment('2017-10-15 23:59:30');
      esClient.getOpenPharmacies(fri13at2359, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Hyde Park Pharmacy');
        done();
      }).catch(done);
    });
    it('should return nearest open pharmacy when none are closed', (done) => {
      const location = { longitude: -0.973733449344135, latitude: 53.9657775613804 };
      const friday2pm = moment('2017-09-15 14:00:00');
      esClient.getOpenPharmacies(friday2pm, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Dunnington Pharmacy');
        done();
      }).catch(done);
    });

    it('should return pharmacies with an alteration that is open', (done) => {
      const location = { longitude: -1.3601, latitude: 50.9778 };
      const alterationsOpen = moment('2017-04-15 11:00:00');
      esClient.getOpenPharmacies(alterationsOpen, location, 25, 2).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.equal(2);
        expect(pharmacies[0].name).to.equal('Boyatt Pharmacy');
        expect(pharmacies[1].name).to.equal('LloydsPharmacy Inside Sainsbury\'s');
        done();
      }).catch(done);
    });

    it('should return pharmacies with an alteration that is closed', (done) => {
      const location = { longitude: -1.3601, latitude: 50.9778 };
      const alterationsClosed = moment('2017-04-15 08:45:00');
      esClient.getOpenPharmacies(alterationsClosed, location, 25, 1).then((pharmacies) => {
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
        pharmacies.forEach(p => expect(p.distanceInMiles).to.be.greaterThan(0, `Pharmacy ${p.identifier} does not have a distance`));
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
