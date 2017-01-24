const utils = require('../lib/utils');

const minimunCloseTimeMins = 1;
const maxDays = 7;

function immediatelyReopens(openingTimes, closingTime) {
  const nextStatus = openingTimes.getStatus(closingTime, { next: true });
  return nextStatus.nextOpen && nextStatus.nextOpen.diff(closingTime, 'minutes') <= minimunCloseTimeMins;
}

function openingSpansMidnight(openingTimes, nextClosed) {
  return utils.closesAtMidnight(nextClosed) && immediatelyReopens(openingTimes, nextClosed);
}

function getNextClosedIgnoringMidnightSpan(openingTimes, nextClosed) {
  const midnightCloseStatus = openingTimes.getStatus(nextClosed, { next: true });
  const tomorrowOpenStatus = openingTimes.getStatus(midnightCloseStatus.nextOpen, { next: true });
  return tomorrowOpenStatus.nextClosed;
}

function setNextCloseToTomorrow(openingTimes, status) {
  let nextClosed = getNextClosedIgnoringMidnightSpan(openingTimes, status.nextClosed);
  let count = 0;
  while (openingSpansMidnight(openingTimes, nextClosed) && count < maxDays) {
    nextClosed = getNextClosedIgnoringMidnightSpan(openingTimes, nextClosed);
    count += 1;
  }
  const newStatus = utils.deepClone(status);
  newStatus.nextClosed = nextClosed;
  newStatus.open24Hours = count === maxDays;
  return newStatus;
}

function midnightSpanCorrector(openingTimes, status) {
  if (openingSpansMidnight(openingTimes, status.nextClosed)) {
    return setNextCloseToTomorrow(openingTimes, status);
  }
  return status;
}

module.exports = midnightSpanCorrector;
