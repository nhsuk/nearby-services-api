const config = require('../../../config/config');
const chai = require('chai');

const expect = chai.expect;

describe('config', () => {
  it('should return pharmacies as the default collection', () => {
    expect(config.es.index).to.be.equal('pharmacies');
  });
});
