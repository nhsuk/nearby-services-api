const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', () => {
  describe('the root', () => {
    it('should return an OK response', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should return hello world', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.json;
          expect(res.body.message).to.equal('Hello World!');
          done();
        });
    });

    it('should return security headers', (done) => {
      chai.request(app).get('/')
      .end((err, res) => {
        expect(res).to.have.header('X-Xss-Protection', '1; mode=block');
        expect(res).to.have.header('X-Frame-Options', 'SAMEORIGIN');
        expect(res).to.have.header('X-Content-Type-Options', 'nosniff');
        expect(res).to.have.header('X-Download-Options', 'noopen');
        expect(res).to.not.have.header('X-Powered-By');
        done();
      });
    });
  });
});
