const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;

module.exports = {
  esGetNearbyPharmacy: new promClient.Histogram({ buckets, help: 'Duration histogram of Elasticsearch request to get nearby Pharmacies', name: 'es_get_nearby_pharmacies' }),
  esGetOpenPharmacy: new promClient.Histogram({ buckets, help: 'Duration histogram of Elasticsearch request to get open Pharmacies', name: 'es_get_open_pharmacies' }),
  esGetTotalPharmacy: new promClient.Histogram({ buckets, help: 'Duration histogram of Elasticsearch request to get Pharmacies', name: 'es_get_pharmacies' }),
};
