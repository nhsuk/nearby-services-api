const express = require('express');
const helmet = require('helmet');
const validator = require('express-validator');
const getServices = require('./app/middleware/getServices');
const promBundle = require('./app/lib/promBundle');
const applicationStarts = require('./app/lib/promCounters').applicationStarts;

const app = express();
app.port = process.env.PORT || 3001;

// start collecting default metrics
promBundle.promClient.collectDefaultMetrics();
applicationStarts.inc(1);

app.use(promBundle.middleware);
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ['\'self\''] } },
  frameguard: { action: 'deny' },
  hsts: { includeSubDomains: false },
  referrerPolicy: { policy: 'no-referrer' },
}));
app.use(validator());
app.use('/nearby', getServices.nearby);
app.use('/open', getServices.open);

module.exports = app;
