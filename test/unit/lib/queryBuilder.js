const chai = require('chai');
const moment = require('moment');
const queryBuilder = require('../../../app/lib/queryBuilder');

const expect = chai.expect;
const location = { longitude: -1.46519099452929, latitude: 54.0095586395326 };

function assertGeoDistance(geoDistance, radius) {
  expect(geoDistance.distance).to.equal(`${radius}mi`);
  expect(geoDistance['location.coordinates'].lon).to.equal(location.longitude);
  expect(geoDistance['location.coordinates'].lat).to.equal(location.latitude);
}

describe('queryBuilder', () => {
  it('buildNearestQuery radius should default to 25 miles', () => {
    const query = queryBuilder.buildNearestQuery(location);
    expect(query.body.query.bool.filter.geo_distance.distance).to.equal('25mi');
  });

  it('buildNearestQuery number of results should default to 2500', () => {
    const query = queryBuilder.buildNearestQuery(location);
    expect(query.body.size).to.equal(2500);
  });

  it('buildNearestQuery should accept location, radius, and size parameters', () => {
    const radius = 10;
    const size = 7;
    const query = queryBuilder.buildNearestQuery(location, radius, size);
    expect(query.body.size).to.equal(size);
    const geoDistance = query.body.query.bool.filter.geo_distance;
    assertGeoDistance(geoDistance, radius);
  });

  it('buildNearestOpenQuery should accept moment, location, radius, and size parameters', () => {
    const radius = 10;
    const size = 7;
    const query = queryBuilder.buildNearestOpenQuery(moment('2017-09-15 14:00:00'), location, radius, size);
    expect(query.body.size).to.equal(size);
    const geoDistance = query.body.query.constant_score.filter.bool.must[1].geo_distance;
    assertGeoDistance(geoDistance, radius);
  });
});
