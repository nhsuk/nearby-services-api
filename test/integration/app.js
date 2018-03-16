const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../app');
const config = require('../../config/config').result;
const utils = require('../lib/testUtils');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', function test() {
  // Setting this timeout as it is calling the real DB...
  this.timeout(utils.maxWaitTimeMs);

  before((done) => {
    utils.waitForSiteReady(done);
  });

  const longitude = -1.55275457242333;
  const latitude = 53.797431921096;
  const coords = { latitude, longitude };

  describe('nearby happy path', () => {
    it('should return an object containing the default number of nearby services', (done) => {
      chai.request(app)
        .get('/nearby')
        .query({ latitude: coords.latitude, longitude: coords.longitude })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          const results = res.body.results;

          expect(results).to.be.instanceof(Array);
          expect(results.length).to.be.equal(config.defaults.nearby);
          done();
        });
    });

    it('should return an object containing the number of nearby services that were requested', (done) => {
      const resultsRequested = 5;

      chai.request(app)
        .get('/nearby')
        .query({
          latitude: coords.latitude,
          'limits:results': resultsRequested,
          longitude: coords.longitude,
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          const results = res.body.results;

          expect(results).to.be.instanceof(Array);
          expect(results.length).to.be.equal(resultsRequested);
          done();
        });
    });

    it('should return an object containing all required properties for nearby services', (done) => {
      chai.request(app)
        .get('/nearby')
        .query({ latitude: coords.latitude, longitude: coords.longitude })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          const results = res.body.results;

          expect(results).to.be.instanceof(Array);
          expect(results.length).to.be.equal(config.defaults.open);
          done();
        });
    });

    it('should return an object containing the number of open services that were requested', (done) => {
      const resultsRequested = 5;

      chai.request(app)
        .get('/open')
        .query({
          latitude: coords.latitude,
          'limits:results': resultsRequested,
          longitude: coords.longitude,
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          const results = res.body.results;

          expect(results).to.be.instanceof(Array);
          expect(results.length).to.be.equal(resultsRequested);
          done();
        });
    });

    it('should return an object containing all required properties for open services', (done) => {
      chai.request(app)
        .get('/open')
        .query({ latitude: coords.latitude, longitude: coords.longitude })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          const results = res.body.results;

          results.forEach((result) => {
            expect(result.identifierType).to.equal('Pharmacy Contract');
            expect(result.openingTimes).to.not.be.undefined;
            expect(result.openingTimes.alterations).to.be.instanceof(Object);
            expect(result.openingTimes.general).to.be.instanceof(Object);
            expect(result.openingTimes.general.monday).to.be.instanceof(Array);
            expect(result.openingTimes.general.tuesday).to.be.instanceof(Array);
            expect(result.openingTimes.general.wednesday).to.be.instanceof(Array);
            expect(result.openingTimes.general.thursday).to.be.instanceof(Array);
            expect(result.openingTimes.general.friday).to.be.instanceof(Array);
            expect(result.openingTimes.general.saturday).to.be.instanceof(Array);
            expect(result.openingTimes.general.sunday).to.be.instanceof(Array);
            expect(result.outOfHours).to.not.be.undefined;
            expect(result.hasEps).to.be.a('boolean');
            expect(result.address).to.be.instanceof(Object);
            expect(result.address.line1).to.not.be.undefined;
            expect(result.address.line2).to.not.be.undefined;
            expect(result.address.line3).to.not.be.undefined;
            expect(result.address.city).to.not.be.undefined;
            expect(result.address.county).to.not.be.undefined;
            expect(result.address.postcode).to.be.a('string');
            expect(result.contacts).to.be.instanceof(Object);
            expect(result.contacts.website).to.not.be.undefined;
            expect(result.contacts.additionalContacts).to.be.instanceof(Array);
            expect(result.contacts.telephoneNumber).to.be.a('string');
            expect(result.contacts.isNonGeographicPhoneNumber).to.be.a('boolean');
            expect(result.contacts.phoneChargeMethod).to.be.a('string');
            expect(result.contacts.phoneChargeAmount).to.not.be.undefined;
            expect(result.contacts.telephoneExtension).to.not.be.undefined;
            expect(result.contacts.fax).to.not.be.undefined;
            expect(result.contacts.email).to.not.be.undefined;
            expect(result.directionsInformation).to.not.be.undefined;
            expect(result.externalProfileUrl).to.not.be.undefined;
            expect(result.identifier).to.be.a('string');
            expect(result.name).to.be.a('string');
            expect(result.organisationType).to.be.a('string');
            expect(result.parkingInformation).to.not.be.undefined;
            expect(result.provider).to.be.a('string');
            expect(result.summary).to.not.be.undefined;
            expect(result.links).to.be.instanceof(Array);
            expect(result.location).to.be.instanceof(Object);
            expect(result.location.type).to.be.a('string');
            expect(result.location.coordinates).to.be.instanceof(Array);
            expect(result.openingTimesAsOffset).to.be.instanceof(Array);
            expect(result.openingTimesAlterationsAsOffset).to.be.instanceof(Array);
            expect(result.distanceInMiles).to.be.a('number');
            expect(result.openingTimesMessage).to.be.a('string');
            expect(result.isOpen).to.be.a('boolean');
            expect(result.nextOpen).to.be.a('string');
          });

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

    describe('when the nearby limit is supplied and is not a number', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
        chai.request(app)
          .get('/nearby')
          .query({
            latitude: coords.latitude,
            'limits:results': 'invalid',
            longitude: coords.longitude,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(1);
            expect(res.body[0].param).to.equal('limits:results');
            expect(res.body[0].msg).to.equal(`limits:results must be a number between ${config.limits.nearby.min} and ${config.limits.nearby.max}`);
            done();
          });
      });
    });

    describe('when the nearby limit is supplied and is greater than the allowed limit', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
        chai.request(app)
          .get('/nearby')
          .query({
            latitude: coords.latitude,
            'limits:results': config.limits.nearby.max + 1,
            longitude: coords.longitude,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(1);
            expect(res.body[0].param).to.equal('limits:results');
            expect(res.body[0].msg).to.equal(`limits:results must be a number between ${config.limits.nearby.min} and ${config.limits.nearby.max}`);
            done();
          });
      });
    });
  });

  describe('open error handling', () => {
    describe('when both latitude and longitude are not included', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
        chai.request(app)
          .get('/open')
          .end((err, res) => {
            expect(res).to.have.status(400);
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
          .get('/open')
          .query({ latitude })
          .end((err, res) => {
            expect(res).to.have.status(400);
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
          .get('/open')
          .query({ longitude })
          .end((err, res) => {
            expect(res).to.have.status(400);
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
          .get('/open')
          .query({
            latitude: coords.latitude,
            'limits:results': 'invalid',
            longitude: coords.longitude,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(1);
            expect(res.body[0].param).to.equal('limits:results');
            expect(res.body[0].msg).to.equal(`limits:results must be a number between ${config.limits.open.min} and ${config.limits.open.max}`);
            done();
          });
      });
    });

    describe('when the open limit is supplied and is greater than the allowed limit', () => {
      it('should return a 400 response and descriptive error messages', (done) => {
        chai.request(app)
          .get('/open')
          .query({
            latitude: coords.latitude,
            'limits:results': config.limits.open.max + 1,
            longitude: coords.longitude,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.instanceof(Array);
            expect(res.body.length).to.equal(1);
            expect(res.body[0].param).to.equal('limits:results');
            expect(res.body[0].msg).to.equal(`limits:results must be a number between ${config.limits.open.min} and ${config.limits.open.max}`);
            done();
          });
      });
    });
  });
});
