const pharmacies = require('../lib/getPharmacies');
const cache = require('memory-cache');
const log = require('../lib/logger');

function getPharmacies(req, res, next) {
  req.checkQuery('latitude', 'latitude is required').notEmpty();
  req.checkQuery('longitude', 'longitude is required').notEmpty();
  req.checkQuery('latitude', 'latitude must be between -90 and 90').isFloat({ min: -90, max: 90 });
  req.checkQuery('longitude', 'longitude must be between -180 and 180').isFloat({ min: -180, max: 180 });
  req.checkQuery('limits:results:open', 'limits:results:open must be a number between 1 and 3').optional().isInt({ min: 1, max: 3 });
  req.checkQuery('limits:results:nearby', 'limits:results:nearby must be a number between 1 and 10').optional().isInt({ min: 1, max: 10 });

  const errors = req.validationErrors();

  if (errors) {
    log.warn(errors, 'getPharmacies errors');
    res.status(400).json(errors);
  } else {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const nearby = req.query['limits:results:nearby'] || 3;
    const open = req.query['limits:results:open'] || 1;
    // Given how search performance is impacted by the radius of the search
    // it has intentionaly not been allowed to be specificed by the client
    const searchRadius = 20;

    const searchPoint = { latitude, longitude };
    const geo = cache.get('geo');
    const limits = { nearby, open, searchRadius };

    log.info('get-pharmacies-start');
    const services = pharmacies.nearby(searchPoint, geo, limits);
    log.info('get-pharmacies-end');

    res.json({ nearby: services.nearbyServices, open: services.openServices });
    next();
  }
}

module.exports = getPharmacies;
