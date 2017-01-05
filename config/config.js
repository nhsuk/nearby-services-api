const dbId = process.env.DB_ID || 'services';
const collectionId = process.env.DB_COLLECTION_ID || 'services';
const dbUrl = `dbs/${dbId}`;

module.exports = {
  docDB: {
    endpoint: process.env.DB_ENDPOINT || 'https://connecting-to-services.documents.azure.com:443/',
    primaryKey: process.env.DB_PRIMARY_KEY,
    collectionUrl: `${dbUrl}/colls/${collectionId}`,
  },
};
