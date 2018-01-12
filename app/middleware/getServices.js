const config = require('../../config/config').result;
const getNearbyServices = require('../lib/getNearbyServices');
const log = require('../lib/logger');

async function validateRequest(req) {
  const maxNearby = config.limits.nearby.max;
  const minNearby = config.limits.nearby.min;
  const maxOpen = config.limits.open.max;
  const minOpen = config.limits.open.min;

  req.checkQuery('latitude', 'latitude is required').notEmpty();
  req.checkQuery('longitude', 'longitude is required').notEmpty();
  req.checkQuery('latitude', 'latitude must be between -90 and 90').isFloat({ min: -90, max: 90 });
  req.checkQuery('longitude', 'longitude must be between -180 and 180').isFloat({ min: -180, max: 180 });
  req.checkQuery('limits:results:open', `limits:results:open must be a number between ${minOpen} and ${maxOpen}`).optional().isInt({ min: minOpen, max: maxOpen });
  req.checkQuery('limits:results:nearby', `limits:results:nearby must be a number between ${minNearby} and ${maxNearby}`).optional().isInt({ min: minNearby, max: maxNearby });
  const result = await req.getValidationResult();
  return result.isEmpty() ? undefined : result.array();
}

function getSearchCoordinates(req) {
  const latitude = parseFloat(req.query.latitude);
  const longitude = parseFloat(req.query.longitude);
  return { longitude, latitude };
}

function getLimits(req) {
  const nearby = Number(req.query['limits:results:nearby']) || config.defaults.nearby;
  const open = Number(req.query['limits:results:open']) || config.defaults.open;
  // Given how search performance is impacted by the radius of the search
  // it has intentionaly not been allowed to be specificed by the client
  const searchRadius = 20;
  return { nearby, open, searchRadius };
}

async function getServices(req, res, next) {
  const errors = await validateRequest(req);
  if (errors) {
    log.warn(errors, 'Errors found on request.');
    res.status(400).json(errors);
  } else {
    try {
      const services = await getNearbyServices(getSearchCoordinates(req), getLimits(req));
      res.json({ nearby: services.nearbyServices, open: services.openServices });
      next();
    } catch (err) {
      res.status(500).send({ err });
      next(err);
    }
  }
}

module.exports = getServices;
