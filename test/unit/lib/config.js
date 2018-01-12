const config = require('../../../config/config');
const chai = require('chai');

const expect = chai.expect;

describe('config', () => {
  it('should return pharmacy defaults for elasticsearch config', () => {
    expect(config.es.index).to.be.equal('pharmacies');
    expect(config.es.type).to.be.equal('pharmacy');
    expect(config.es.host).to.be.equal('es');
    expect(config.es.port).to.be.equal('9200');
  });

  it('should return result limits defaults', () => {
    expect(config.resultLimits.open.min).to.be.equal(1);
    expect(config.resultLimits.open.max).to.be.equal(10);
    expect(config.resultLimits.nearby.min).to.be.equal(1);
    expect(config.resultLimits.nearby.max).to.be.equal(10);
  });
});
