const log = require('../../app/lib/logger');
const MongoClient = require('mongodb').MongoClient;
const mongodbConfig = require('../../config/config').mongodb;
const filterServices = require('./filterServices');
const VError = require('verror').VError;

const connectionString = mongodbConfig.connectionString;

function getNearbyServices(searchPoint, limits, next) {
  MongoClient.connect(connectionString).then((db) => {
    const col = db.collection(mongodbConfig.collection);

    col.aggregate([{
      $geoNear: {
        near: { type: 'Point', coordinates: searchPoint.coordinates },
        distanceField: 'dist',
        maxDistance: 20 * 1609, // search across 20 miles
        distanceMultiplier: 0.000621371, // this is in miles
        num: 2500, // Arbitary number of results to make sure we get everything within 20 miles
        spherical: true,
      },
    }]).toArray((errGeo, docs) => {
      if (errGeo) {
        const errMsg = 'MongoDB error while making near query.';
        log.error({ err: new VError(errGeo, errMsg) }, errMsg);
        next(errGeo);
      }

      log.info({ mongoDBResponse: { numberOfResults: docs.length, searchPoint: { type: 'Point', coordinates: searchPoint.coordinates } } }, 'MongoDB results returned.');

      const filteredServices = filterServices(docs, limits);

      db.close((errClose, result) => {
        if (errClose) {
          const errMsg = 'MongoDB error while closing connection.';
          log.error({ err: new VError(errClose, errMsg) }, errMsg);
          next(errClose);
        }
        log.debug({ result }, 'Closed MongoDB connection.');
        next(null, filteredServices);
      });
    });
  }).catch((err) => {
    const errMsg = 'MongoDB error while making connection.';
    log.error({ err: new VError(err, errMsg) }, errMsg);
  });
}

module.exports = getNearbyServices;
