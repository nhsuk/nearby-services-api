const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;

module.exports = {
  esGetNearbyPharmacy: new promClient.Histogram({ name: 'es_get_nearby_pharmacies', help: 'Duration histogram of Elasticsearch request to get nearby Pharmacies', buckets }),
  esGetOpenPharmacy: new promClient.Histogram({ name: 'es_get_open_pharmacies', help: 'Duration histogram of Elasticsearch request to get open Pharmacies', buckets }),
  esGetTotalPharmacy: new promClient.Histogram({ name: 'es_get_pharmacies', help: 'Duration histogram of Elasticsearch request to get Pharmacies', buckets }),
};
