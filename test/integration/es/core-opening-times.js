const chai = require('chai');
const moment = require('moment');
const esFunctions = require('../../../app/lib/esFunctions');
const utils = require('../../lib/testUtils');

const expect = chai.expect;

describe('esFunctions', function test() {
  this.timeout(utils.maxWaitTimeMs);

  before((done) => {
    utils.waitForSiteReady(done);
  });

  describe('getOpenPharmacies', () => {
    it('should return open pharmacies rather than closest closed pharmacy', (done) => {
      const location = { latitude: 54.0095586395326, longitude: -1.46519099452929 };
      const feb14at10pm = moment('2017-02-14 22:00:00');
      esFunctions.getOpenPharmacies(feb14at10pm, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Boots');
        done();
      }).catch(done);
    });

    it('should return open if closes Friday 23:59 and re-opens Saturday at 00:00', (done) => {
      const location = { latitude: 53.355021, longitude: -1.485343 };
      const fri13at2359 = moment('2017-10-13 23:59:30');
      esFunctions.getOpenPharmacies(fri13at2359, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Abbeydale Pharmacy');
        done();
      }).catch(done);
    });

    it('should return open if closes Sunday 23:59 and reopens Monday at 00:00', (done) => {
      const location = { latitude: 53.805765, longitude: -1.568446 };
      const fri13at2359 = moment('2017-10-15 23:59:30');
      esFunctions.getOpenPharmacies(fri13at2359, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Hyde Park Pharmacy');
        done();
      }).catch(done);
    });

    it('should return nearest open pharmacy when none are closed', (done) => {
      const location = { latitude: 53.9657775613804, longitude: -0.973733449344135 };
      const friday2pm = moment('2017-09-15 14:00:00');
      esFunctions.getOpenPharmacies(friday2pm, location).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.be.greaterThan(0);
        expect(pharmacies[0].name).to.equal('Dunnington Pharmacy');
        done();
      }).catch(done);
    });
  });
});
