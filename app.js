const express = require('express');
const helmet = require('helmet');
const getPharmacies = require('./app/middleware/getPharmacies');
const loadData = require('./config/loadData');
const validator = require('express-validator');

loadData();

const app = express();
app.port = process.env.PORT || 3001;

app.use(helmet());
app.use(validator());
app.use('/nearby', getPharmacies);

module.exports = app;
