const chai = require('chai');
const build = require('../../../app/lib/queryBuilder').build;

const expect = chai.expect;
const location = { longitude: -1.46519099452929, latitude: 54.0095586395326 };

describe('queryBuilder', () => {
  it('radius should default to 25 miles', () => {
    const query = build(location);
    expect(query.body.query.bool.filter.geo_distance.distance).to.equal('25mi');
  });

  it('number of results should default to 2500', () => {
    const query = build(location);
    expect(query.body.size).to.equal(2500);
  });

  it('queryBuilder should accept location, radius, and size parameters', () => {
    const radius = 10;
    const size = 7;
    const query = build(location, radius, size);
    expect(query.body.size).to.equal(size);
    const geoDistance = query.body.query.bool.filter.geo_distance;
    expect(geoDistance.distance).to.equal(`${radius}mi`);
    expect(geoDistance['location.coordinates'].lon).to.equal(location.longitude);
    expect(geoDistance['location.coordinates'].lat).to.equal(location.latitude);
  });
});
