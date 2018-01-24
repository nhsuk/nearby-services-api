const chai = require('chai');
const moment = require('moment');
require('moment-timezone');

const addMessages = require('../../../app/lib/addMessages');
const utils = require('../../../app/lib/utils');

const expect = chai.expect;

describe('addMessages', () => {
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

  it('should return the opening times message, open status, openingTimesOverview, and next open', () => {
    const momentString = '2017-01-02 11:00';
    const momentInstance = moment(momentString);
    const nextOpenDateString = momentInstance.format('ddd MMM DD YYYY');
    const pharmacies = [alwaysOpenOrg];

    const openServices = addMessages(pharmacies, momentInstance);

    expect(openServices.length).to.be.equal(1);
    expect(openServices[0].isOpen).to.be.equal(true);
    expect(openServices[0].openingTimesMessage).to.be.equal('Open 24 hours');
    expect(openServices[0].openingTimesOverview).to.not.be.undefined;
    expect(openServices[0].nextOpen).to.not.be.undefined;
    expect(new Date(openServices[0].nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should return the opening times message, open status and next open when between 12:00am and 01:00am British Summer Time', () => {
    const justAfterMidnightSundayBST = '2017-10-15T23:00:53.000Z';
    const nextOpenDateString = new Date(justAfterMidnightSundayBST).toDateString();

    const pharmacies = [spanningSundayMidnightOrg];

    // timezone required for correct results
    const momentTime = moment(justAfterMidnightSundayBST).clone().tz('Europe/London');
    const openServices = addMessages(pharmacies, momentTime);
    expect(openServices.length).to.be.equal(1);
    expect(openServices[0].openingTimesMessage).to.be.equal('Open until 8pm today');
    expect(openServices[0].isOpen).to.be.equal(true);
    expect(openServices[0].openingTimesOverview).to.not.be.undefined;
    expect(openServices[0].nextOpen).to.not.be.undefined;
    expect(new Date(openServices[0].nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should return the opening times message, open status and next open when before 12:00am British Summer Time', () => {
    const beforeMidnightSundayBST = '2017-10-15T22:00:53.000Z';
    const nextOpenDateString = new Date(beforeMidnightSundayBST).toDateString();

    const pharmacies = [spanningSundayMidnightOrg];

    // timezone required for correct results
    const momentTime = moment(beforeMidnightSundayBST).clone().tz('Europe/London');
    const openServices = addMessages(pharmacies, momentTime);
    expect(openServices.length).to.be.equal(1);
    expect(openServices[0].openingTimesMessage).to.be.equal('Open until 8pm tomorrow');
    expect(openServices[0].isOpen).to.be.equal(true);
    expect(openServices[0].openingTimesOverview).to.not.be.undefined;
    expect(openServices[0].nextOpen).to.not.be.undefined;
    expect(new Date(openServices[0].nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should return the opening times message, open status and next open when one minute before 12:00am British Summer Time', () => {
    const justBeforeMidnightSundayBST = '2017-10-15T22:59:00.000Z';
    const nextOpenDateString = new Date(justBeforeMidnightSundayBST).toDateString();

    const pharmacies = [spanningSundayMidnightOrg];

    // timezone required for correct results
    const momentTime = moment(justBeforeMidnightSundayBST).clone().tz('Europe/London');
    const openServices = addMessages(pharmacies, momentTime);
    expect(openServices.length).to.be.equal(1);
    expect(openServices[0].openingTimesMessage).to.be.equal('Open until 8pm tomorrow');
    expect(openServices[0].isOpen).to.be.equal(true);
    expect(openServices[0].openingTimesOverview).to.not.be.undefined;
    expect(openServices[0].nextOpen).to.not.be.undefined;
    expect(new Date(openServices[0].nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should use alterations opening times', () => {
    const momentDate = '2017-03-01';
    const nextOpenDateString = new Date(momentDate).toDateString();
    const nowDate = moment(momentDate).format('YYYY-MM-DD');
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

    const openServices = addMessages(pharmacies, moment(momentDate));

    expect(openServices[0].isOpen).to.be.equal(true);
    expect(openServices[0].openingTimesMessage).to.be.equal('Open until midnight');
    expect(openServices[0].openingTimesOverview).to.be.undefined;
    expect(openServices[0].nextOpen).to.not.be.undefined;
    expect(new Date(openServices[0].nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should return nextOpen as the next time open when not already open', () => {
    const momentDate = '2017-03-01';
    const nextOpenDate = '2017-03-02';
    const nextOpenDateString = new Date(nextOpenDate).toDateString();
    const nowDate = moment(momentDate).format('YYYY-MM-DD');
    const alterations = {};
    alterations[nowDate] = [];

    const orgWithAlterations = utils.deepClone(alwaysOpenOrg);
    orgWithAlterations.openingTimes.alterations = alterations;

    const orgs = [orgWithAlterations];

    const openServices = addMessages(orgs, moment(momentDate));

    expect(openServices[0].isOpen).to.be.equal(false);
    expect(openServices[0].openingTimesMessage).to.be.equal('Closed until 12am tomorrow');
    expect(openServices[0].openingTimesOverview).to.not.be.undefined;
    expect(openServices[0].nextOpen).to.not.be.undefined;
    expect(new Date(openServices[0].nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should say call for opening times when the org does not have any opening times', () => {
    const toFilter = [{ contacts: { telephoneNumber: '01234567890' }, obj: {} }];

    const nearbyServices = addMessages(toFilter, moment());

    expect(nearbyServices.length).to.be.equal(1);
    expect(nearbyServices[0].isOpen).to.be.equal(false);
    expect(nearbyServices[0].openingTimesOverview).to.be.undefined;
    expect(nearbyServices[0].openingTimesMessage).to.be.equal('Call for opening times');
    expect(nearbyServices[0].nextOpen).to.be.undefined;
  });

  it('should say we can\' find any opening times when the org does not have any opening times or a phone number', () => {
    const toFilter = [{ obj: {} }];

    const nearbyServices = addMessages(toFilter, moment());

    expect(nearbyServices.length).to.be.equal(1);
    expect(nearbyServices[0].isOpen).to.be.equal(false);
    expect(nearbyServices[0].openingTimesOverview).to.be.undefined;
    expect(nearbyServices[0].openingTimesMessage).to.be.equal('We can\'t find any opening times');
    expect(nearbyServices[0].nextOpen).to.be.undefined;
  });
});
