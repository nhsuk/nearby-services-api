const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;

module.exports = {
  esGetNearbyPharmacy: new promClient.Histogram({ name: 'es_get_nearby_pharmacy', help: 'Duration histogram of Elasticsearch request to get nearby Pharmacies', buckets }),
  esGetOpenPharmacy: new promClient.Histogram({ name: 'es_get_open_pharmacy', help: 'Duration histogram of Elasticsearch request to get open Pharmacies', buckets }),
  esGetTotalPharmacy: new promClient.Histogram({ name: 'es_get_total_pharmacy', help: 'Duration histogram of sum of both Elasticsearch requests to get Pharmacies', buckets }),
};
