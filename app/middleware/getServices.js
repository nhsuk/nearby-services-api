const config = require('../../config/config').result;
const getServices = require('../lib/getServices');
const log = require('../lib/logger');

async function validateRequest(req, type) {
  const limits = type === 'open' ? config.limits.open : config.limits.nearby;
  const min = limits.min;
  const max = limits.max;

  req.checkQuery('latitude', 'latitude is required').notEmpty();
  req.checkQuery('longitude', 'longitude is required').notEmpty();
  req.checkQuery('latitude', 'latitude must be between -90 and 90').isFloat({ max: 90, min: -90 });
  req.checkQuery('longitude', 'longitude must be between -180 and 180').isFloat({ max: 180, min: -180 });
  req.checkQuery('limits:results', `limits:results must be a number between ${min} and ${max}`).optional().isInt({ max, min });
  const result = await req.getValidationResult();
  return result.isEmpty() ? undefined : result.array();
}

function getSearchCoordinates(req) {
  const latitude = parseFloat(req.query.latitude);
  const longitude = parseFloat(req.query.longitude);
  return { latitude, longitude };
}

function getLimits(req, type) {
  const results = Number(req.query['limits:results']) || (type === 'open' ? config.defaults.open : config.defaults.nearby);
  return results;
}

async function getNearbyServices(req, res, next) {
  const type = 'nearby';
  const errors = await validateRequest(req, type);
  if (errors) {
    log.warn(errors, 'Errors found on request.');
    res.status(400).json(errors);
  } else {
    try {
      const results = await getServices.nearby(getSearchCoordinates(req), getLimits(req, type));
      res.json({ results });
      next();
    } catch (err) {
      res.status(500).send({ err });
      next(err);
    }
  }
}

async function getOpenServices(req, res, next) {
  const type = 'open';
  const errors = await validateRequest(req, type);
  if (errors) {
    log.warn(errors, 'Errors found on request.');
    res.status(400).json(errors);
  } else {
    try {
      const results = await getServices.open(getSearchCoordinates(req), getLimits(req, type));
      res.json({ results });
      next();
    } catch (err) {
      res.status(500).send({ err });
      next(err);
    }
  }
}

module.exports = {
  nearby: getNearbyServices,
  open: getOpenServices,
};
