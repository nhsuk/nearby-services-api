const db = process.env.MONGODB_DB || 'services';
const collection = process.env.MONGODB_COLLECTION || 'pharmacies';
const host = process.env.MONGODB_HOST || 'mongo';
const port = process.env.MONGODB_PORT || 27017;
const connectionString = `mongodb://${host}:${port}/${db}`;

module.exports = {
  hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
  es: {
    host: process.env.ES_HOST || 'es',
    port: process.env.ES_PORT || '9200',
    index: process.env.ES_INDEX || 'pharmacies',
  },
  mongodb: {
    collection,
    connectionString,
  },
};
