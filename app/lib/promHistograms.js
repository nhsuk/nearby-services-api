const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;

module.exports = {
  esGetPharmacy: new promClient.Histogram({ name: 'es_get_pharmacy', help: 'Duration histogram of Elasticsearch request to get Pharmacies', buckets }),
};
