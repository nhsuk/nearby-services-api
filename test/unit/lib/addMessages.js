const chai = require('chai');
const moment = require('moment');
require('moment-timezone');

const addMessages = require('../../../app/lib/addMessages');

const expect = chai.expect;

describe('addMessages', () => {
  const nowDateString = new Date().toDateString();
  const alwaysOpenOrg = {
    openingTimes: {
      general: {
        monday: [{ opens: '00:00', closes: '23:59' }],
        tuesday: [{ opens: '00:00', closes: '23:59' }],
        wednesday: [{ opens: '00:00', closes: '23:59' }],
        thursday: [{ opens: '00:00', closes: '23:59' }],
        friday: [{ opens: '00:00', closes: '23:59' }],
        saturday: [{ opens: '00:00', closes: '23:59' }],
        sunday: [{ opens: '00:00', closes: '23:59' }],
      },
    },
  };

  it('should return the opening times message, open status and next open', () => {
    const pharmacies = [alwaysOpenOrg];

    const openServices = addMessages(pharmacies, moment());

    expect(openServices.length).to.be.equal(1);
    expect(openServices[0].isOpen).to.be.equal(true);
    expect(openServices[0].openingTimesMessage).to.be.equal('Open 24 hours');
    expect(openServices[0].nextOpen).to.not.be.undefined;
    expect(new Date(openServices[0].nextOpen).toDateString()).to.be.equal(nowDateString);
  });

  it('should return the opening times message, open status and next open when between 12:00am and 01:00am British Summer Time', () => {
    const nextOpenDateString = new Date('2017-10-15').toDateString();
    const spanningSundayMidnightOrg = {
      openingTimes: {
        general: {
          monday: [{ opens: '00:00', closes: '20:00' }, { opens: '23:00', closes: '23:59' }],
          tuesday: [{ opens: '00:00', closes: '23:59' }],
          wednesday: [{ opens: '00:00', closes: '23:59' }],
          thursday: [{ opens: '00:00', closes: '23:59' }],
          friday: [{ opens: '00:00', closes: '23:59' }],
          saturday: [{ opens: '00:00', closes: '23:59' }],
          sunday: [{ opens: '10:00', closes: '16:00' }, { opens: '23:00', closes: '23:59' }],
        },
      },
    };
    const pharmacies = [spanningSundayMidnightOrg];

    const justAfterMidnightSundayBST = '2017-10-15T23:00:53.000Z';
    // timezone required for correct results
    const momentTime = moment(justAfterMidnightSundayBST).clone().tz('Europe/London');
    const openServices = addMessages(pharmacies, momentTime);
    expect(openServices.length).to.be.equal(1);
    expect(openServices[0].openingTimesMessage).to.be.equal('Open until 8pm today');
    expect(openServices[0].isOpen).to.be.equal(true);
    expect(openServices[0].nextOpen).to.not.be.undefined;
    expect(new Date(openServices[0].nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should use alterations opening times', () => {
    const nowDate = moment().format('YYYY-MM-DD');
    const alterations = {};
    alterations[nowDate] = [{ opens: '00:00', closes: '23:59' }];

    const orgWithAlterations = {
      openingTimes: {
        general: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
        alterations,
      },
    };

    const pharmacies = [orgWithAlterations];

    const openServices = addMessages(pharmacies, moment());

    expect(openServices[0].isOpen).to.be.equal(true);
    expect(openServices[0].openingTimesMessage).to.be.equal('Open until midnight');
    expect(openServices[0].nextOpen).to.not.be.undefined;
    expect(new Date(openServices[0].nextOpen).toDateString()).to.be.equal(nowDateString);
  });

  it('should say call for opening times when the org does not have any opening times', () => {
    const toFilter = [{ obj: {} }];

    const nearbyServices = addMessages(toFilter, moment());

    expect(nearbyServices.length).to.be.equal(1);
    expect(nearbyServices[0].isOpen).to.be.equal(false);
    expect(nearbyServices[0].openingTimesMessage).to.be.equal('Call for opening times');
    expect(nearbyServices[0].nextOpen).to.be.undefined;
  });
});
