function geoSpatialQuery(searchPoint, searchRadius) {
  const metersInAMile = 1609;
  const searchRadiusInMiles = searchRadius * metersInAMile;
  const stringifiedSearchPoint = JSON.stringify(searchPoint);

  const query =
    `SELECT
      services.id,
      services.identifier,
      services.name,
      services.address,
      services.contacts,
      services.openingTimes,
      ST_DISTANCE(services.location, ${stringifiedSearchPoint}) / ${metersInAMile} AS distanceInMiles
    FROM services
    WHERE ST_DISTANCE(services.location, ${stringifiedSearchPoint}) < ${searchRadiusInMiles}`;

  return query;
}

module.exports = {
  geoSpatialQuery,
};
