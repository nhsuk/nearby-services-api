const db = process.env.MONGODB_DB || 'services';
const collection = process.env.MONGODB_COLLECTION || 'pharmacies';
const host = process.env.MONGODB_HOST || 'mongo';
const port = process.env.MONGODB_PORT || 27017;
const connectionString = `mongodb://${host}:${port}/${db}`;

module.exports = {
  mongodb: {
    host,
    port,
    db,
    collection,
    connectionString,
  },
};
