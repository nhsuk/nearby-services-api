const chai = require('chai');
const moment = require('moment');
const queryBuilder = require('../../../app/lib/queryBuilder');

const expect = chai.expect;
const location = { longitude: -1.46519099452929, latitude: 54.0095586395326 };

describe('queryBuilder', () => {
  it('build radius should default to 25 miles', () => {
    const query = queryBuilder.build(location);
    expect(query.body.query.bool.filter.geo_distance.distance).to.equal('25mi');
  });

  it('build number of results should default to 2500', () => {
    const query = queryBuilder.build(location);
    expect(query.body.size).to.equal(2500);
  });

  it('build should accept location, radius, and size parameters', () => {
    const radius = 10;
    const size = 7;
    const query = queryBuilder.build(location, radius, size);
    expect(query.body.size).to.equal(size);
    const geoDistance = query.body.query.bool.filter.geo_distance;
    expect(geoDistance.distance).to.equal(`${radius}mi`);
    expect(geoDistance['location.coordinates'].lon).to.equal(location.longitude);
    expect(geoDistance['location.coordinates'].lat).to.equal(location.latitude);
  });

  // todo: interim test, needs expanding
  it('buildOpenQuery should accept moment, location, radius, and size parameters', () => {
    const radius = 10;
    const size = 7;
    const query = queryBuilder.buildOpenQuery(moment(new Date()), location, radius, size);
    expect(query.body.size).to.equal(size);
  });
});
