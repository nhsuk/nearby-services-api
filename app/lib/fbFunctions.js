const request = require('request');

const collection = process.env.FUN_COLLECTION || 'pharmacy-finder';
const minutesInADay = 1440;
const kmsPerMile = 1.60934;
const urlStart = `https://nhs-dev-search01.squiz.co.uk/s/search.json?collection=${collection}&MBL=100000&query=`;

function getOptions(time, coordinates, radius, results) {
  const timeRange = time ? `&ge_closes=${time}&le_opens=${time}` : '';
  const query = time ? 'altDate:weekly' : 'isMaster:true';
  const geoRange = `&maxdist=${radius * kmsPerMile}&origin=${coordinates.latitude},${coordinates.longitude}&sort=prox&num_ranks=${results}`;
  const url = urlStart + query + timeRange + geoRange;
  return {
    method: 'get',
    url,
    headers: {
      'content-type': 'application/json'
    },
    strictSSL: false
  };
}

async function search(options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

function dayOfWeekFromMonday(moment) {
  const dayOfWeek = moment.day() - 1;
  return dayOfWeek > -1 ? dayOfWeek : 6;
}

function timeToMinutesSinceMidnightMonday(moment) {
  return (dayOfWeekFromMonday(moment) * minutesInADay) + (moment.hours() * 60) + moment.minutes();
}

function decode(content) {
  return Buffer.from(content, 'base64').toString('ascii');
}

function mapResult(record) {
  const metadata = record.metaData;
  let openingTimes;
  if (metadata.openingTimes) {
    openingTimes = JSON.parse(decode(metadata.openingTimes));
  }
  return {
    identifier: metadata.identifier,
    name: metadata.name,
    address: {
      line1: metadata.addressLine1,
      line2: metadata.addressLine2,
      line3: metadata.addressLine3,
      city: metadata.addressCity,
      county: metadata.addressCounty,
      postcode: metadata.addressPostcode,
    },
    contacts: {
      telephoneNumber: metadata.telephoneNumber,
    },
    distanceInMiles: record.kmFromOrigin * 0.621,
    openingTimes,
  };
}

async function getOpenPharmacies(moment, coordinates, radius = 20, maxResults = 10) {
  const time = moment && timeToMinutesSinceMidnightMonday(moment);
  const res = await search(getOptions(time, coordinates, radius, maxResults));
  const results = JSON.parse(res).response.resultPacket.results;
  return results.map(mapResult);
}

async function getPharmacies(coordinates, radius = 20, maxResults = 10) {
  return getOpenPharmacies(undefined, coordinates, radius, maxResults);
}

module.exports = {
  getPharmacies,
  getOpenPharmacies,
};
