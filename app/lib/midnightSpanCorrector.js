const utils = require('../lib/utils');

const minimunCloseTimeMins = 1;

function immediatelyReopens(openingTimes, closingTime) {
  const nextStatus = openingTimes.getStatus(closingTime, { next: true });
  return nextStatus.nextOpen && nextStatus.nextOpen.diff(closingTime, 'minutes') <= minimunCloseTimeMins;
}

function setNextCloseToTomorrow(openingTimes, status) {
  const midnightCloseStatus = openingTimes.getStatus(status.nextClosed, { next: true });
  const tomorrowOpenStatus = openingTimes.getStatus(midnightCloseStatus.nextOpen, { next: true });
  const newStatus = utils.deepClone(status);
  newStatus.nextClosed = tomorrowOpenStatus.nextClosed;
  return newStatus;
}

function openingSpansMidnight(openingTimes, nextClosed) {
  return utils.closesAtMidnight(nextClosed) && immediatelyReopens(openingTimes, nextClosed);
}

function midnightSpanCorrector(openingTimes, status) {
  if (openingSpansMidnight(openingTimes, status.nextClosed)) {
    return setNextCloseToTomorrow(openingTimes, status);
  }
  return status;
}

module.exports = midnightSpanCorrector;
