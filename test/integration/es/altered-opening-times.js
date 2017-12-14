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

    it('should not return a pharmacy that is normally open but is closed by alterations', (done) => {
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
