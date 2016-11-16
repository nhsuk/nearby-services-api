const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', () => {
  it('should return hello world', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        // eslint-disable-next-line no-unused-expressions
        expect(res).to.be.json;
        expect(res.body.message).to.equal('Hello World!');
        done();
      });
  });
});
