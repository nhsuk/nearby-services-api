const chai = require('chai');
const moment = require('moment');
const addMessages = require('../../../app/lib/addMessages');

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

  it('should return the opening times message and open state', () => {
    const pharmacies = [alwaysOpenOrg];

    const openServices = addMessages(pharmacies, moment());

    expect(openServices.length).to.be.equal(1);
    expect(openServices[0].isOpen).to.be.equal(true);
    expect(openServices[0].openingTimesMessage).to.be.equal('Open 24 hours');
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
  });

  it('should say call for opening times when the org does not have any opening times', () => {
    const toFilter = [{ obj: {} }];

    const nearbyServices = addMessages(toFilter, moment());

    expect(nearbyServices.length).to.be.equal(1);
    expect(nearbyServices[0].isOpen).to.be.equal(false);
    expect(nearbyServices[0].openingTimesMessage).to.be.equal('Call for opening times');
  });
});
