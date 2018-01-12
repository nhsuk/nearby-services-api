const moment = require('moment');

const daysOfWeekOrderedForUi = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatTimeString(timeString) {
  const time = moment();
  const [hours, minutes] = timeString.split(':').map(Number);
  time.minute(minutes);
  time.hour(hours);
  const formatString = time.minutes() === 0 ? 'ha' : 'h:mma';
  return time.format(formatString);
}

function getFirstOpenLastClosed(sessions) {
  const firstOpen = sessions[0].opens;
  const lastOpen = sessions[sessions.length - 1] && sessions[sessions.length - 1].closes;
  return `${formatTimeString(firstOpen)} - ${formatTimeString(lastOpen)}`;
}

function mapDay(sessions) {
  if (sessions === undefined) {
    return 'No information available';
  }

  if (sessions.length === 0) {
    return 'CLOSED';
  }
  return getFirstOpenLastClosed(sessions);
}

function isOpen(times) {
  return daysOfWeekOrderedForUi.some((day) => {
    const daySessions = times[day.toLowerCase()];
    return daySessions && daySessions.length > 0;
  });
}

function formatOpeningTimes(times) {
  if (isOpen(times) === false) {
    return undefined;
  }
  const openCloseTimes = [];

  daysOfWeekOrderedForUi.forEach((day) => {
    const daySessions = times[day.toLowerCase()];
    const openingTimes = mapDay(daySessions);

    openCloseTimes.push({ day, openingTimes });
  });

  return openCloseTimes;
}

module.exports = formatOpeningTimes;
