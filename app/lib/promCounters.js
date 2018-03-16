const promClient = require('./promBundle').promClient;

module.exports = {
  applicationStarts: new promClient.Counter({ help: 'The number of times the application has been started', name: 'app_starts' }),
};
