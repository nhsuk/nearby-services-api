const config = require('../../../config/config');
const chai = require('chai');

const expect = chai.expect;

describe('config', () => {
  it('should return services as the default db', () => {
    expect(config.mongodb.db).to.be.equal('services');
  });

  it('should return services as the default collection', () => {
    expect(config.mongodb.collection).to.be.equal('services');
  });

  it('should return mongo as the default host', () => {
    expect(config.mongodb.host).to.be.equal('mongo');
  });

  it('should return 27017 as the default port', () => {
    expect(config.mongodb.port).to.be.equal(27017);
  });

  it('should return the correct connection string based on the default values', () => {
    const host = config.mongodb.host;
    const port = config.mongodb.port;
    const db = config.mongodb.db;

    expect(config.mongodb.connectionString).to.be.equal(`mongodb://${host}:${port}/${db}`);
  });
});
