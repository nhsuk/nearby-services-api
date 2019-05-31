const log = require('./app/lib/logger');
const app = require('./app');

app.listen(app.port, () => {
  log.info(`Express Finders-API server listening on port ${app.port}.`);
});
