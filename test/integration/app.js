const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', function test() {
  // Setting this timeout as it is calling the real DB...
  this.timeout(10000);
  const longitude = -1.55275457242333;
  const latitude = 53.797431921096;
  const coords = { latitude, longitude };

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

    it('should return an object containing the number of nearby and open services that were requested', (done) => {
      const openResults = 2;
      const nearbyResults = 5;

      chai.request(app)
        .get('/nearby')
        .query({
          latitude: coords.latitude,
          longitude: coords.longitude,
          'limits:results:open': openResults,
          'limits:results:nearby': nearbyResults,
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.json;

          const nearby = res.body.nearby;
          const open = res.body.open;

          expect(nearby).to.be.instanceof(Array);
          expect(open).to.be.instanceof(Array);
          expect(nearby.length).to.be.equal(nearbyResults);
          expect(open.length).to.be.equal(openResults);
          done();
        });
    });
  });

  describe('nearby error handling', () => {
    describe('when both latitude and longitude are not included', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
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
    });

    describe('when longitude is not included', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
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
    });

    describe('when latitude is not included', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
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

    describe('when the open limit is supplied and is not a number', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
        chai.request(app)
          .get('/nearby')
          .query({
            latitude: coords.latitude,
            longitude: coords.longitude,
            'limits:results:open': 'invalid'
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            // eslint-disable-next-line no-unused-expressions
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(1);
            expect(res.body[0].param).to.equal('limits:results:open');
            expect(res.body[0].msg).to.equal('limits:results:open must be a number between 1 and 3');
            done();
          });
      });
    });

    describe('when the nearby limit is supplied and is not a number', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
        chai.request(app)
          .get('/nearby')
          .query({
            latitude: coords.latitude,
            longitude: coords.longitude,
            'limits:results:nearby': 'invalid',
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            // eslint-disable-next-line no-unused-expressions
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(1);
            expect(res.body[0].param).to.equal('limits:results:nearby');
            expect(res.body[0].msg).to.equal('limits:results:nearby must be a number between 1 and 10');
            done();
          });
      });
    });

    describe('when nearby and open limits are supplied as empty values', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
        chai.request(app)
          .get('/nearby')
          .query({
            latitude: coords.latitude,
            longitude: coords.longitude,
            'limits:results:open': '',
            'limits:results:nearby': ''
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            // eslint-disable-next-line no-unused-expressions
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(2);
            expect(res.body[0].param).to.equal('limits:results:open');
            expect(res.body[0].msg).to.equal('limits:results:open must be a number between 1 and 3');
            expect(res.body[0].value).to.equal('');
            expect(res.body[1].param).to.equal('limits:results:nearby');
            expect(res.body[1].msg).to.equal('limits:results:nearby must be a number between 1 and 10');
            expect(res.body[1].value).to.equal('');
            done();
          });
      });
    });
  });
});
