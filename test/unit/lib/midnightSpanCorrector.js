const chai = require('chai');
const chaiMoment = require('chai-moment');
const Moment = require('moment');
const OpeningTimes = require('moment-opening-times');
const midnightSpanCorrector = require('../../../app/lib/midnightSpanCorrector');

chai.use(chaiMoment);
chaiMoment.setErrorFormat('LLLL');

const expect = chai.expect;
const aSunday = new Moment('2016-07-24T00:00:00+00:00');

function getAbuttingMidnightDay2359() {
  return [
    { opens: '00:00', closes: '20:00' },
    { opens: '23:00', closes: '23:59' },
  ];
}

function getAbuttingMidnightDay0000() {
  return [
    { opens: '00:00', closes: '20:00' },
    { opens: '23:00', closes: '00:00' },
  ];
}

function getClosedDay() {
  return [];
}

function setUpAllWeek(getTimes) {
  const week = {};

  Moment.weekdays().forEach((d) => {
    const day = d.toLowerCase();
    week[day] = getTimes();
  });

  return week;
}

function getRegularWorkingWeekAbuttingMidnightAt2359() {
  const week = setUpAllWeek(getAbuttingMidnightDay2359);
  week.sunday = getClosedDay();
  return week;
}

function getRegularWorkingWeekAbuttingMidnightAt0000() {
  const week = setUpAllWeek(getAbuttingMidnightDay0000);
  week.sunday = getClosedDay();
  return week;
}

function getNewOpeningTimes(openingTimes, timeZone, alterations) {
  return new OpeningTimes(openingTimes, timeZone, alterations);
}

function getMoment(day, hours, minutes, timeZone) {
  const dayNumber = Moment
    .weekdays()
    .map(d => d.toLowerCase())
    .indexOf(day);
  const moment = new Moment(aSunday).tz(timeZone);
  moment.add(dayNumber, 'days').hours(hours).minutes(minutes);
  return moment;
}

function momentsShouldBeSame(moment1, moment2) {
  expect(moment1).to.be.sameMoment(moment2);
}

describe('Midnight Span Corrector', () => {
  describe('handle times abutting midnight', () => {
    it('should use next day\'s closing time for a close at 23:59 and open at 00:00 the next day', () => {
      const openingTimesJson = getRegularWorkingWeekAbuttingMidnightAt2359();
      const openingTimes = getNewOpeningTimes(openingTimesJson, 'Europe/London');
      const moment = getMoment('monday', 23, 30, 'Europe/London');
      const status = openingTimes.getStatus(moment, { next: true });
      const newStatus = midnightSpanCorrector(openingTimes, status);
      momentsShouldBeSame(newStatus.nextClosed, getMoment('tuesday', 20, 0, 'Europe/London'));
    });

    it('should use next day\'s closing time for a close at 00:00 and open at 00:00 the next day', () => {
      const openingTimesJson = getRegularWorkingWeekAbuttingMidnightAt0000();
      const openingTimes = getNewOpeningTimes(openingTimesJson, 'Europe/London');
      const moment = getMoment('monday', 23, 30, 'Europe/London');
      const status = openingTimes.getStatus(moment, { next: true });
      const newStatus = midnightSpanCorrector(openingTimes, status);
      momentsShouldBeSame(newStatus.nextClosed, getMoment('tuesday', 20, 0, 'Europe/London'));
    });

    it('should not correct time if closes at 23:59 opens later than 00:00 the next day', () => {
      const openingTimesJson = getRegularWorkingWeekAbuttingMidnightAt2359();
      const openingTimes = getNewOpeningTimes(openingTimesJson, 'Europe/London');
      const moment = getMoment('saturday', 23, 30, 'Europe/London');
      const status = openingTimes.getStatus(moment, { next: true });
      const newStatus = midnightSpanCorrector(openingTimes, status);
      expect(newStatus).to.be.equal(status);
    });

    it('should not correct time if closes at 00:00 and opens later than 00:00 the next day', () => {
      const openingTimesJson = getRegularWorkingWeekAbuttingMidnightAt0000();
      const openingTimes = getNewOpeningTimes(openingTimesJson, 'Europe/London');
      const moment = getMoment('saturday', 23, 30, 'Europe/London');
      const status = openingTimes.getStatus(moment, { next: true });
      const newStatus = midnightSpanCorrector(openingTimes, status);
      expect(newStatus).to.be.equal(status);
    });

    it('should use next days closing time for a close at 23:59 and open at 00:00 the next day at 23:59', () => {
      const openingTimesJson = getRegularWorkingWeekAbuttingMidnightAt2359();
      const openingTimes = getNewOpeningTimes(openingTimesJson, 'Europe/London');
      const moment = getMoment('monday', 23, 59, 'Europe/London');
      const status = openingTimes.getStatus(moment, { next: true });
      const newStatus = midnightSpanCorrector(openingTimes, status);
      momentsShouldBeSame(newStatus.nextClosed, getMoment('tuesday', 20, 0, 'Europe/London'));
    });
  });
});
