const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const utils = require('../lib/testUtils');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', function test() {
  // Setting this timeout as it is calling the real DB...
  this.timeout(utils.maxWaitTimeMs);

  before((done) => {
    utils.waitForSiteReady(done);
  });

  it('security headers should be returned', (done) => {
    chai.request(app)
      .get('/nearby')
      .end((err, res) => {
        expect(res).to.have.header('Content-Security-Policy', 'default-src \'self\'');
        expect(res).to.have.header('X-Xss-Protection', '1; mode=block');
        expect(res).to.have.header('X-Frame-Options', 'DENY');
        expect(res).to.have.header('X-Content-Type-Options', 'nosniff');
        expect(res).to.have.header('X-Download-Options', 'noopen');
        expect(res).to.not.have.header('X-Powered-By');
        expect(res).to.have.header('Strict-Transport-Security', 'max-age=15552000');
        expect(res).to.have.header('Referrer-policy', 'no-referrer');
        done();
      });
  });
});
