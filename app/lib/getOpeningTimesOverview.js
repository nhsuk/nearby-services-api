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

function getDayOpeningTimes(sessions) {
  if (sessions === undefined) {
    return undefined;
  }
  if (sessions.length === 0) {
    return {};
  }
  const firstOpen = sessions[0].opens;
  const lastOpen = sessions[sessions.length - 1] && sessions[sessions.length - 1].closes;
  return { opens: formatTimeString(firstOpen), closes: formatTimeString(lastOpen) };
}

function isOpen(times) {
  return daysOfWeekOrderedForUi.some((day) => {
    const daySessions = times[day.toLowerCase()];
    return daySessions && daySessions.length > 0;
  });
}

function getOpeningTimesOverview(times) {
  if (isOpen(times) === false) {
    return undefined;
  }
  const openCloseTimes = [];

  daysOfWeekOrderedForUi.forEach((day) => {
    const daySessions = times[day.toLowerCase()];
    const openingTimes = getDayOpeningTimes(daySessions);
    openCloseTimes.push({ day, openingTimes });
  });

  return openCloseTimes;
}

module.exports = getOpeningTimesOverview;
