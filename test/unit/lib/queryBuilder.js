const chai = require('chai');
const moment = require('moment');
const queryBuilder = require('../../../app/lib/queryBuilder');

const expect = chai.expect;
const location = { longitude: -1.46519099452929, latitude: 54.0095586395326 };

describe('queryBuilder', () => {
  it('buildNearestQuery should accept location, and size parameters', () => {
    const size = 7;
    const query = queryBuilder.buildNearestQuery(location, size);
    expect(query.body.size).to.equal(size);
  });

  it('buildNearestOpenQuery should accept moment, location, and size parameters', () => {
    const size = 7;
    const query = queryBuilder.buildNearestOpenQuery(moment('2017-09-15 14:00:00'), location, size);
    expect(query.body.size).to.equal(size);
  });
});
