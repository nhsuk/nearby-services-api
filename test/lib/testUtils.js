const esClient = require('../../app/lib/esClient');
const esConfig = require('../../config/config').es;

const maxWaitTimeMs = 3 * 60 * 1000;
const gracePeriodMs = 5000;
const pollingIntervalMs = 3000;

const type = esConfig.type;
const index = esConfig.index;

function esServerReady() {
  // Note: yellow is the highest state for a single cluster
  return esClient.getHealth().then(health => health[0].status === 'yellow').catch(() => false);
}

function removeWhitespace(text) {
  return text && text.trim().replace(/\s+/g, ' ');
}

async function updateAndConfirmChanges(id, body) {
  await esClient.client.update({
    refresh: 'true',
    index,
    type,
    id,
    body,
  });
}

function waitForEsToStart(done, startTime) {
  esServerReady().then((res) => {
    if (res) {
      // errors may occur for calls immediately after return, wait a short time before continuing
      setTimeout(() => done(), gracePeriodMs);
    } else if ((new Date() - startTime) > maxWaitTimeMs) {
      done(`Error: server did not respond within ${maxWaitTimeMs}ms`);
    } else {
      setTimeout(() => waitForEsToStart(done, startTime), pollingIntervalMs);
    }
  });
}

function waitForSiteReady(done) {
  waitForEsToStart(done, new Date());
}

module.exports = {
  maxWaitTimeMs,
  removeWhitespace,
  updateAndConfirmChanges,
  waitForSiteReady,
};
