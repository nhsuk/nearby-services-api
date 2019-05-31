const chai = require('chai');
const config = require('../../../config/config');

const expect = chai.expect;

describe('config', () => {
  it('should return pharmacy defaults for elasticsearch config', () => {
    expect(config.es.index).to.equal('pharmacies');
    expect(config.es.type).to.equal('pharmacy');
    expect(config.es.host).to.equal('es');
    expect(config.es.port).to.equal('9200');
  });

  it('should return result limits defaults', () => {
    expect(config.result.limits.open.min).to.equal(1);
    expect(config.result.limits.open.max).to.equal(10);
    expect(config.result.limits.nearby.min).to.equal(1);
    expect(config.result.limits.nearby.max).to.equal(10);
  });

  it('should return result defaults', () => {
    expect(config.result.defaults.open).to.equal(10);
    expect(config.result.defaults.nearby).to.equal(10);
  });
});
