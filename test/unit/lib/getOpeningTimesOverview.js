const chai = require('chai');
const getOpeningTimesOverview = require('../../../app/lib/getOpeningTimesOverview');

const expect = chai.expect;

describe('getOpeningTimesOverview', () => {
  it('should return first open and last closes for each day as hour and am/pm', () => {
    const openingTimes = {
      general: {
        monday: [{ opens: '08:00', closes: '15:00' }, { opens: '16:00', closes: '17:00' }],
        tuesday: [{ opens: '09:00', closes: '15:00' }, { opens: '16:00', closes: '18:00' }],
        wednesday: [{ opens: '10:00', closes: '15:00' }, { opens: '16:00', closes: '19:00' }],
        thursday: [{ opens: '11:00', closes: '15:00' }, { opens: '16:00', closes: '20:00' }],
        friday: [{ opens: '12:00', closes: '15:00' }, { opens: '16:00', closes: '21:00' }],
        saturday: [{ opens: '13:00', closes: '15:00' }, { opens: '16:00', closes: '22:00' }],
        sunday: [{ opens: '14:00', closes: '15:00' }, { opens: '16:00', closes: '23:00' }]
      }
    };

    const weeklyOpensCloses = getOpeningTimesOverview(openingTimes.general);
    expect(weeklyOpensCloses).to.exist;
    expect(weeklyOpensCloses[0].day).to.equal('Monday');
    expect(weeklyOpensCloses[0].openingTimes.opens).to.equal('8am');
    expect(weeklyOpensCloses[0].openingTimes.closes).to.equal('5pm');
    expect(weeklyOpensCloses[1].day).to.equal('Tuesday');
    expect(weeklyOpensCloses[1].openingTimes.opens).to.equal('9am');
    expect(weeklyOpensCloses[1].openingTimes.closes).to.equal('6pm');
    expect(weeklyOpensCloses[2].day).to.equal('Wednesday');
    expect(weeklyOpensCloses[2].openingTimes.opens).to.equal('10am');
    expect(weeklyOpensCloses[2].openingTimes.closes).to.equal('7pm');
    expect(weeklyOpensCloses[3].day).to.equal('Thursday');
    expect(weeklyOpensCloses[3].openingTimes.opens).to.equal('11am');
    expect(weeklyOpensCloses[3].openingTimes.closes).to.equal('8pm');
    expect(weeklyOpensCloses[4].day).to.equal('Friday');
    expect(weeklyOpensCloses[4].openingTimes.opens).to.equal('12pm');
    expect(weeklyOpensCloses[4].openingTimes.closes).to.equal('9pm');
    expect(weeklyOpensCloses[5].day).to.equal('Saturday');
    expect(weeklyOpensCloses[5].openingTimes.opens).to.equal('1pm');
    expect(weeklyOpensCloses[5].openingTimes.closes).to.equal('10pm');
    expect(weeklyOpensCloses[6].day).to.equal('Sunday');
    expect(weeklyOpensCloses[6].openingTimes.opens).to.equal('2pm');
    expect(weeklyOpensCloses[6].openingTimes.closes).to.equal('11pm');
  });

  it('should return undefined opening times when closed all week', () => {
    const openingTimes = {
      general: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      }
    };
    const weeklyOpensCloses = getOpeningTimesOverview(openingTimes.general);
    expect(weeklyOpensCloses).to.not.exist;
  });

  it('should return undefined opening times for day when sessions undefined', () => {
    const openingTimes = {
      general: {
        monday: undefined,
        tuesday: [{ opens: '08:00', closes: '17:00' }],
      }
    };
    const weeklyOpensCloses = getOpeningTimesOverview(openingTimes.general);
    expect(weeklyOpensCloses).to.exist;
    expect(weeklyOpensCloses[0].day).to.equal('Monday');
    expect(weeklyOpensCloses[0].openingTimes).to.not.exist;
  });

  it('should return defined openingTimes, but undefined opens and closes for a day that is closed, i.e empty array of sessions', () => {
    const openingTimes = {
      general: {
        monday: [{ opens: '08:00', closes: '17:00' }],
        tuesday: [],
      }
    };
    const weeklyOpensCloses = getOpeningTimesOverview(openingTimes.general);
    expect(weeklyOpensCloses).to.exist;
    expect(weeklyOpensCloses[1].day).to.equal('Tuesday');
    expect(weeklyOpensCloses[1].openingTimes).to.exist;
    expect(weeklyOpensCloses[1].openingTimes.opens).to.not.exist;
    expect(weeklyOpensCloses[1].openingTimes.closes).to.not.exist;
  });

  it('should handle days with three sessions', () => {
    const openingTimes = {
      general: {
        monday: [
          { opens: '08:00', closes: '12:00' },
          { opens: '13:00', closes: '16:00' },
          { opens: '17:00', closes: '19:00' },
        ],
      }
    };
    const weeklyOpensCloses = getOpeningTimesOverview(openingTimes.general);
    expect(weeklyOpensCloses).to.exist;
    expect(weeklyOpensCloses[0].day).to.equal('Monday');
    expect(weeklyOpensCloses[0].openingTimes.opens).to.equal('8am');
    expect(weeklyOpensCloses[0].openingTimes.closes).to.equal('7pm');
  });

  it('should display minutes in opening time if they are not zero', () => {
    const openingTimes = {
      general: {
        monday: [{ opens: '08:30', closes: '17:30' }],
      }
    };
    const weeklyOpensCloses = getOpeningTimesOverview(openingTimes.general);
    expect(weeklyOpensCloses).to.exist;
    expect(weeklyOpensCloses[0].day).to.equal('Monday');
    expect(weeklyOpensCloses[0].openingTimes.opens).to.equal('8:30am');
    expect(weeklyOpensCloses[0].openingTimes.closes).to.equal('5:30pm');
  });
});
