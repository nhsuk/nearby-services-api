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

    log.debug('coordinates lat ' + searchPoint.coordinates + ' long ' + searchPoint.coordinates)
    db.command({
        geoNear: 'location',
        near: { type: 'Point', coordinates: searchPoint.coordinates },
        distanceField: 'dist',
        maxDistance: 32180,
        distanceMultiplier: 0.001, // this is in miles
        num: 2500, // Arbitary number of results to make sure we get everything within 20 miles
        spherical: true,
        query: { category: "public" }
    }, function(errGeo, cb){
      if (errGeo) {
        const errMsg = 'MongoDB error while making near query';
        log.error({ err: new VError(errGeo, errMsg) }, errMsg);
        next(errGeo);
      }

      if (geoNear.ok == 0) {
        const errMsg = 'MongoDB error on retrieving geoNear';
        log.error({ err: new VError('geoNear has not succeeded', errMsg) }, errMsg);
        next(errGeo);
      }

      log.debug(`Found ${geoNear.results.length} results for near search around [${searchPoint.coordinates}] (lon,lat)`);

      const filteredServices = filterServices(geoNear.results, limits);

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
