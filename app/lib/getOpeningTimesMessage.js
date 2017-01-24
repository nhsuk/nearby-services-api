const utils = require('../lib/utils');

function getDayDescriptor(moment, referenceMoment) {
  const dayDescriptors = {
    sameDay: '[today]',
    nextDay: '[tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[yesterday]',
    lastWeek: '[last] dddd',
    sameElse: 'DD/MM/YYYY',
  };
  return moment.calendar(referenceMoment, dayDescriptors);
}

function midnightAs0000Tomorrow(nextClosed, dayDesc) {
  return nextClosed.format('HH:mm') === '00:00' && dayDesc === 'tomorrow';
}

function getOpenUntilMidnightMessage(status) {
  const message = 'Open until midnight';
  const dayDesc = getDayDescriptor(status.nextClosed, status.moment);
  if (dayDesc === 'today' || midnightAs0000Tomorrow(status.nextClosed, dayDesc)) {
    return message;
  }
  return `${message} ${dayDesc}`;
}

function getClosingMessage(status) {
  const timeUntilOpen = status.nextOpen.diff(status.moment, 'minutes');
  if (timeUntilOpen <= 60) {
    return `Opening in ${timeUntilOpen} minutes`;
  }
  return `Closed until ${status.nextOpen.format('h:mm a')} ` +
    `${getDayDescriptor(status.nextOpen, status.moment)}`;
}

function getOpeningHoursMessage(status) {
  const callForTimesMessage = 'Call for opening times';

  if ((status.isOpen && !status.nextClosed) || (!status.isOpen && !status.nextOpen)) {
    return callForTimesMessage;
  }

  if (status.open24Hours === true) {
    return 'Open 24 hours';
  }

  if (status.isOpen === true) {
    if (utils.closesAtMidnight(status.nextClosed)) {
      return getOpenUntilMidnightMessage(status);
    }
    return `Open until ${status.nextClosed.format('h:mm a')} ` +
      `${getDayDescriptor(status.nextClosed, status.moment)}`;
  } else if (status.isOpen === false) {
    return getClosingMessage(status);
  }
  return callForTimesMessage;
}

module.exports = getOpeningHoursMessage;
