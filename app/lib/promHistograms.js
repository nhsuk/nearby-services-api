const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;

module.exports = {
  esGetPharmacy: new promClient.Histogram({ name: 'es_get_pharmacy', help: 'Duration histogram of Elasticsearch request to get Pharmacies', buckets }),
  filterServices: new promClient.Histogram({ name: 'filter_services', help: 'Duration histogram of filtering the returned pharmacies based on their openness', buckets }),
};
