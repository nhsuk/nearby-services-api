const DocDBClient = require('documentdb').DocumentClient;
const docDB = require('../../config/config').docDB;

module.exports = new DocDBClient(docDB.endpoint, { masterKey: docDB.primaryKey });
