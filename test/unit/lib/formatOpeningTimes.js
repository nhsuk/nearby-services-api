const chai = require('chai');
const formatOpeningTimes = require('../../../app/lib/formatOpeningTimes');

const expect = chai.expect;

describe('formatOpeningTimes', () => {
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

    const weeklyOpensCloses = formatOpeningTimes(openingTimes.general);
    expect(weeklyOpensCloses).to.exist;
    expect(weeklyOpensCloses[0].day).to.equal('Monday');
    expect(weeklyOpensCloses[0].openingTimes).to.equal('8am - 5pm');
    expect(weeklyOpensCloses[1].day).to.equal('Tuesday');
    expect(weeklyOpensCloses[1].openingTimes).to.equal('9am - 6pm');
    expect(weeklyOpensCloses[2].day).to.equal('Wednesday');
    expect(weeklyOpensCloses[2].openingTimes).to.equal('10am - 7pm');
    expect(weeklyOpensCloses[3].day).to.equal('Thursday');
    expect(weeklyOpensCloses[3].openingTimes).to.equal('11am - 8pm');
    expect(weeklyOpensCloses[4].day).to.equal('Friday');
    expect(weeklyOpensCloses[4].openingTimes).to.equal('12pm - 9pm');
    expect(weeklyOpensCloses[5].day).to.equal('Saturday');
    expect(weeklyOpensCloses[5].openingTimes).to.equal('1pm - 10pm');
    expect(weeklyOpensCloses[6].day).to.equal('Sunday');
    expect(weeklyOpensCloses[6].openingTimes).to.equal('2pm - 11pm');
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
    const weeklyOpensCloses = formatOpeningTimes(openingTimes.general);
    expect(weeklyOpensCloses).to.not.exist;
  });

  it('should return CLOSED for a day with no opening times', () => {
    const openingTimes = {
      general: {
        monday: [{ opens: '08:00', closes: '17:00' }],
        tuesday: [],
      }
    };
    const weeklyOpensCloses = formatOpeningTimes(openingTimes.general);
    expect(weeklyOpensCloses).to.exist;
    expect(weeklyOpensCloses[1].day).to.equal('Tuesday');
    expect(weeklyOpensCloses[1].openingTimes).to.equal('CLOSED');
  });

  it('should not display minutes in opening time if they are zero', () => {
    const openingTimes = {
      general: {
        monday: [{ opens: '08:00', closes: '17:00' }],
        tuesday: [{ opens: '08:30', closes: '17:30' }],
      }
    };
    const weeklyOpensCloses = formatOpeningTimes(openingTimes.general);
    expect(weeklyOpensCloses).to.exist;
    expect(weeklyOpensCloses[0].day).to.equal('Monday');
    expect(weeklyOpensCloses[0].openingTimes).to.equal('8am - 5pm');
    expect(weeklyOpensCloses[1].day).to.equal('Tuesday');
    expect(weeklyOpensCloses[1].openingTimes).to.equal('8:30am - 5:30pm');
  });
});
