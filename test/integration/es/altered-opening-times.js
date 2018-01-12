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

  describe('pharmacies with opening hours changed by alterations', () => {
    const FAQ27DateOfChange = '2016-12-26';
    const FAQ27 = 'FAQ27';
    const FCJ43DateOfChange = '2017-04-16';
    const FCJ43 = 'FCJ43';
    const FCJ43Body = {
      doc: {
        openingTimes: {
          alterations: {
            '201704-16': [{
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
    };

    const FAQ27Body = {
      doc: {
        openingTimesAlterationsAsOffset: [{
          date: FAQ27DateOfChange,
        }],
      },
    };

    before('set up data', async () => {
      await utils.updateAndConfirmChanges(FCJ43, FCJ43Body);
      await utils.updateAndConfirmChanges(FAQ27, FAQ27Body);
    });

    it('should not return a pharmacy that is normally open but is closed by alterations', (done) => {
      const latitude = '50.816619873046875';
      const longitude = '-1.0798419713974';
      const location = { longitude, latitude };
      const alterationsOpen = moment(`${FAQ27DateOfChange} 23:59:00`);

      esFunctions.getOpenPharmacies(alterationsOpen, location, 1).then((pharmacies) => {
        expect(pharmacies[0].identifier).to.not.equal(FAQ27);
        done();
      }).catch(done);
    });

    it('should return a pharmacy that is normally closed but is open by alterations', (done) => {
      const latitude = '50.9777946472168';
      const longitude = '-1.3598793745040894';
      const location = { longitude, latitude };
      const alterationsOpen = moment(`${FCJ43DateOfChange} 11:00:00`);

      esFunctions.getOpenPharmacies(alterationsOpen, location, 1).then((pharmacies) => {
        expect(pharmacies[0].identifier).to.equal(FCJ43);
        done();
      }).catch(done);
    });

    it('should return pharmacies with an alteration that is closed', (done) => {
      const location = { longitude: -1.3601, latitude: 50.9778 };
      const alterationsClosed = moment('2017-04-15 08:45:00');
      esFunctions.getOpenPharmacies(alterationsClosed, location, 1).then((pharmacies) => {
        expect(pharmacies).to.be.an('array');
        expect(pharmacies.length).to.equal(1);
        expect(pharmacies[0].name).to.equal('Boots');
        done();
      }).catch(done);
    });
  });
});
