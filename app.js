const express = require('express');
const helmet = require('helmet');
const getServices = require('./app/middleware/getServices');
const validator = require('express-validator');

const app = express();
app.port = process.env.PORT || 3001;

app.use(helmet());
app.use(validator());
app.use('/nearby', getServices);

module.exports = app;
