const db = process.env.MONGODB_DB || 'services';
const collection = process.env.MONGODB_COLLECTION || 'services';
const host = process.env.MONGODB_HOST || 'localhost';
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
