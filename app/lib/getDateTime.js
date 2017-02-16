const moment = require('moment');
// use this instead of moment to control current date for testing purposes

function getDateTime() {
  return moment(process.env.DATETIME || Date.now());
}

module.exports = getDateTime;
