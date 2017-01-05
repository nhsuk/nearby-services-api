const express = require('express');
const helmet = require('helmet');
const docDBClient = require('./app/lib/docDBClient');
const getServices = require('./app/middleware/getServices');
const validator = require('express-validator');

const app = express();
app.port = process.env.PORT || 3001;

app.use(helmet());
app.use(validator());
app.use('/nearby', getServices);

app.locals.docDBClient = docDBClient;

module.exports = app;
