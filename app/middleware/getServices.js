const getNearbyServices = require('../lib/getNearbyServices');
const log = require('../lib/logger');

function getServices(req, res, next) {
  req.checkQuery('latitude', 'latitude is required').notEmpty();
  req.checkQuery('longitude', 'longitude is required').notEmpty();
  req.checkQuery('latitude', 'latitude must be between -90 and 90').isFloat({ min: -90, max: 90 });
  req.checkQuery('longitude', 'longitude must be between -180 and 180').isFloat({ min: -180, max: 180 });
  req.checkQuery('limits:results:open', 'limits:results:open must be a number between 1 and 3').optional().isInt({ min: 1, max: 3 });
  req.checkQuery('limits:results:nearby', 'limits:results:nearby must be a number between 1 and 10').optional().isInt({ min: 1, max: 10 });

  const errors = req.validationErrors();

  if (errors) {
    log.warn(errors, 'Errors found on request.');
    res.status(400).json(errors);
  } else {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const nearby = req.query['limits:results:nearby'] || 3;
    const open = req.query['limits:results:open'] || 1;
    // Given how search performance is impacted by the radius of the search
    // it has intentionaly not been allowed to be specificed by the client
    const searchRadius = 20;

    const searchPoint = { type: 'Point', coordinates: [longitude, latitude] };
    const limits = { nearby, open, searchRadius };

    getNearbyServices(searchPoint, limits, (err, services) => {
      if (err) {
        res.status(500).send({ err });
        next(err);
      } else {
        res.json({ nearby: services.nearbyServices, open: services.openServices });
        next();
      }
    });
  }
}

module.exports = getServices;
