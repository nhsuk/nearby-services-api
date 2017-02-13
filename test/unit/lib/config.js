const config = require('../../../config/config');
const chai = require('chai');

const expect = chai.expect;

describe('config', () => {
  it('should return pharmacies as the default collection', () => {
    expect(config.mongodb.collection).to.be.equal('pharmacies');
  });

  it('should return the correct connection string based on the default values', () => {
    const defaultHost = 'mongo';
    const defaultPort = '27017';
    const defaultDb = 'services';

    expect(config.mongodb.connectionString).to.be.equal(`mongodb://${defaultHost}:${defaultPort}/${defaultDb}`);
  });
});
