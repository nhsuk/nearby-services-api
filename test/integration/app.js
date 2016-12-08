const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', () => {
  const longitude = -1.55275457242333;
  const latitude = 53.797431921096;

  describe('security headers', () => {
    it('should be returned for a valid request', (done) => {
      chai.request(app)
        .get('/nearby')
        .query({ latitude, longitude })
        .end((err, res) => {
          expect(res).to.have.header('X-Xss-Protection', '1; mode=block');
          expect(res).to.have.header('X-Frame-Options', 'SAMEORIGIN');
          expect(res).to.have.header('X-Content-Type-Options', 'nosniff');
          expect(res).to.have.header('X-Download-Options', 'noopen');
          expect(res).to.not.have.header('X-Powered-By');
          done();
        });
    });

    it('should be returned for an invalid request', (done) => {
      chai.request(app)
        .get('/nearby')
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

  describe('nearby happy path', () => {
    const coords = { latitude, longitude };

    it('should return an object containing 3 nearby and 1 open services by default', (done) => {
      chai.request(app)
        .get('/nearby')
        .query({ latitude: coords.latitude, longitude: coords.longitude })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.json;

          const nearby = res.body.nearby;
          const open = res.body.open;

          expect(nearby).to.be.instanceof(Array);
          expect(open).to.be.instanceof(Array);
          expect(nearby.length).to.be.equal(3);
          expect(open.length).to.be.equal(1);
          done();
        });
    });
  });

  describe('nearby error handling', () => {
    describe('returns 400 responses and descriptive error messages when requests are bad', () => {
      it('when both latitude and longitude are not included', (done) => {
        chai.request(app)
          .get('/nearby')
          .end((err, res) => {
            expect(res).to.have.status(400);
            // eslint-disable-next-line no-unused-expressions
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(4);
            expect(res.body[0].param).to.equal('latitude');
            expect(res.body[0].msg).to.equal('latitude is required');
            expect(res.body[1].param).to.equal('longitude');
            expect(res.body[1].msg).to.equal('longitude is required');
            expect(res.body[2].param).to.equal('latitude');
            expect(res.body[2].msg).to.equal('latitude must be between -90 and 90');
            expect(res.body[3].param).to.equal('longitude');
            expect(res.body[3].msg).to.equal('longitude must be between -180 and 180');
            done();
          });
      });

      it('when longitude is not included', (done) => {
        chai.request(app)
          .get('/nearby')
          .query({ latitude })
          .end((err, res) => {
            expect(res).to.have.status(400);
            // eslint-disable-next-line no-unused-expressions
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(2);
            expect(res.body[0].param).to.equal('longitude');
            expect(res.body[0].msg).to.equal('longitude is required');
            expect(res.body[1].param).to.equal('longitude');
            expect(res.body[1].msg).to.equal('longitude must be between -180 and 180');
            done();
          });
      });

      it('when latitude is not included', (done) => {
        chai.request(app)
          .get('/nearby')
          .query({ longitude })
          .end((err, res) => {
            expect(res).to.have.status(400);
            // eslint-disable-next-line no-unused-expressions
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(2);
            expect(res.body[0].param).to.equal('latitude');
            expect(res.body[0].msg).to.equal('latitude is required');
            expect(res.body[1].param).to.equal('latitude');
            expect(res.body[1].msg).to.equal('latitude must be between -90 and 90');
            done();
          });
      });
    });
  });
});
