const utils = require('../lib/utils');

function closesAtMidnight(moment) {
  const time = moment.format('HH:mm');
  return (time === '00:00' || time === '23:59');
}

function immediatelyReopens(openingTimes, closingTime) {
  const nextStatus = openingTimes.getStatus(closingTime, { next: true });
  return nextStatus.nextOpen && nextStatus.nextOpen.diff(closingTime, 'minutes') <= 1;
}

function setNextCloseToTomorrow(openingTimes, status) {
  const midnightCloseStatus = openingTimes.getStatus(status.nextClosed, { next: true });
  const nextDayClosed = openingTimes.getStatus(midnightCloseStatus.nextOpen, { next: true });
  const newStatus = utils.deepClone(status);
  newStatus.nextClosed = nextDayClosed.nextClosed;
  return newStatus;
}

function midnightSpanCorrector(openingTimes, status) {
  if (closesAtMidnight(status.nextClosed) && immediatelyReopens(openingTimes, status.nextClosed)) {
    return setNextCloseToTomorrow(openingTimes, status);
  }
  return status;
}

module.exports = midnightSpanCorrector;
