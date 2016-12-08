const pharmacies = require('../lib/getPharmacies');
const cache = require('memory-cache');
const log = require('../lib/logger');

function getPharmacies(req, res, next) {
  req.checkQuery('latitude', 'latitude is required').notEmpty();
  req.checkQuery('longitude', 'longitude is required').notEmpty();
  req.checkQuery('latitude', 'latitude must be between -90 and 90').isFloat({ min: -90, max: 90 });
  req.checkQuery('longitude', 'longitude must be between -180 and 180').isFloat({ min: -180, max: 180 });

  const errors = req.validationErrors();

  if (errors) {
    log.warn(errors, 'getPharmacies errors');
    res.status(400).json(errors);
  }

  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  const searchPoint = {
    latitude,
    longitude,
  };
  const geo = cache.get('geo');
  // TODO: Take the limits from the request
  const limits = { nearby: 3, open: 1 };

  log.info('get-pharmacies-start');
  const nearby = pharmacies.nearby(searchPoint, geo, limits);
  log.info('get-pharmacies-end');

  res.json({ nearby: nearby.nearbyServices, open: nearby.openServices });
  next();
}

module.exports = getPharmacies;
