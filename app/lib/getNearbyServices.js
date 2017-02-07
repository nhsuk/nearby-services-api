const log = require('../../app/lib/logger');
const MongoClient = require('mongodb').MongoClient;
const co = require('co');
const mongodbConfig = require('../../config/config').mongodb;
const filterServices = require('./filterServices');
const VError = require('verror').VError;

const connectionString = mongodbConfig.connectionString;

function getNearbyServices(searchPoint, limits, next) {
  co(function* a() {
    const db = yield MongoClient.connect(connectionString);
    log.debug(`Connected to ${mongodbConfig.connectionString}`);

    const col = db.collection(mongodbConfig.db);

    col.aggregate([{
      $geoNear: {
        near: { type: 'Point', coordinates: searchPoint.coordinates },
        distanceField: 'dist',
        maxDistance: 32180,
        distanceMultiplier: 0.001, // this is in miles
        num: 2500, // Arbitary number of results to make sure we get everything within 20 miles
        spherical: true,
      },
    }]).toArray((errGeo, docs) => {
      if (errGeo) {
        const errMsg = 'MongoDB error while making near query';
        log.error({ err: new VError(errGeo, errMsg) }, errMsg);
        next(errGeo);
      }

      log.debug(`Found ${docs.length} results for near search around [${searchPoint.coordinates}] (lon,lat)`);

      const filteredServices = filterServices(docs, limits);

      db.close((errClose, result) => {
        if (errClose) {
          const errMsg = 'MongoDB error while closing connection';
          log.error({ err: new VError(errClose, errMsg) }, errMsg);
          next(errClose);
        }
        log.debug({ result }, 'Closed MongoDB connection');
        next(null, filteredServices);
      });
    });
  }).catch((err) => {
    const errMsg = 'MongoDB error while making connection';
    log.error({ err: new VError(err, errMsg) }, errMsg);
  });
}

module.exports = getNearbyServices;
