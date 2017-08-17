const log = require('../../app/lib/logger');
const MongoClient = require('mongodb').MongoClient;
const mongodbConfig = require('../../config/config').mongodb;
const filterServices = require('./filterServices');
const VError = require('verror').VError;

const connectionString = mongodbConfig.connectionString;

function getNearbyServices(searchPoint, limits, next) {
  MongoClient.connect(connectionString).then((db) => {
    const collection = db.collection(mongodbConfig.collection);

    const loc = searchPoint.coordinates;
    const milesInARadian = 3959;
    const distanceToSearchInMiles = 20;
    const maxDistance = distanceToSearchInMiles / milesInARadian;
    const distanceMultiplier = milesInARadian;

    collection
      .geoNear(loc[0], loc[1], { num: 2500, maxDistance, distanceMultiplier, spherical: true })
      .then((docs) => {
        log.info({ mongoDBResponse: { numberOfResults: docs.results.length, searchPoint: { type: 'Point', coordinates: searchPoint.coordinates } } }, 'MongoDB results returned.');

        const filteredServices = filterServices(docs.results, limits);

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
