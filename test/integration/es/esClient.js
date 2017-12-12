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

    describe('pharmacies with opening hours changed by alterations', () => {
      const FAQ27DateOfChange = '2016-12-26';
      const FAQ27 = 'FAQ27';
      const FCJ43DateOfChange = '2017-04-16';
      const FCJ43 = 'FCJ43';

      before('set up data', async () => {
        await esClient.client.update({
          index: 'pharmacies',
          type: 'pharmacy',
          id: FCJ43,
          body: {
            doc: {
              openingTimes: {
                alterations: {
                  FCJ43DateOfChange: [{
                    opens: '10:00',
                    closes: '12:00',
                  }]
                },
              },
              openingTimesAlterationsAsOffset: [{
                date: FCJ43DateOfChange,
                opens: 600,
                closes: 720,
              }],
            },
          },
        });
        const FCJ43Response = await esClient.client.get({
          index: 'pharmacies',
          type: 'pharmacy',
          id: FCJ43,
        });
        // eslint-disable-next-line no-underscore-dangle
        const FCJ43Obj = FCJ43Response._source;
        expect(FCJ43Obj.openingTimesAlterationsAsOffset).to.be.an('array');
        expect(FCJ43Obj.openingTimesAlterationsAsOffset.length).to.equal(1);

        await esClient.client.update({
          index: 'pharmacies',
          type: 'pharmacy',
          id: FAQ27,
          body: {
            doc: {
              openingTimesAlterationsAsOffset: [{
                date: FAQ27DateOfChange,
              }],
            },
          },
        });
        const FAQ27Response = await esClient.client.get({
          index: 'pharmacies',
          type: 'pharmacy',
          id: FCJ43,
        });
        // eslint-disable-next-line no-underscore-dangle
        const FAQ27Obj = FAQ27Response._source;
        expect(FAQ27Obj.openingTimesAlterationsAsOffset).to.be.an('array');
        expect(FAQ27Obj.openingTimesAlterationsAsOffset.length).to.equal(1);
      });

      // This is breaking
      it('should return a pharmacy that is normally open but is closed by alterations', (done) => {
        const latitude = '50.816619873046875';
        const longitude = '-1.0798419713974';
        const location = { longitude, latitude };
        const alterationsOpen = moment(`${FAQ27DateOfChange} 23:59:00`);

        esClient.getOpenPharmacies(alterationsOpen, location, 25, 1).then((pharmacies) => {
          expect(pharmacies[0].identifier).to.not.equal(FAQ27);
          done();
        }).catch(done);
      });

      it('should return a pharmacy that is normally closed but is open by alterations', (done) => {
        const latitude = '50.9777946472168';
        const longitude = '-1.3598793745040894';
        const location = { longitude, latitude };
        const alterationsOpen = moment(`${FCJ43DateOfChange} 11:00:00`);

        esClient.getOpenPharmacies(alterationsOpen, location, 25, 1).then((pharmacies) => {
          expect(pharmacies[0].identifier).to.equal(FCJ43);
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
          esClient.getPharmacies(location, 5, resultsLimit),
          esClient.getPharmacies(location, 1, resultsLimit)
        ])
        .then((pharmacies) => {
          expect(pharmacies[0].length).to.be.greaterThan(pharmacies[1].length);
          done();
        })
        .catch(done);
    });
  });
});
