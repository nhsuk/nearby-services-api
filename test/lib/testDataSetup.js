const esClient = require('../../app/lib/esClient');
const esConfig = require('../../config/config').es;

const type = esConfig.type;
const index = esConfig.index;

async function updateAndConfirmChanges(id, body) {
  await esClient.client.update({
    refresh: 'true',
    index,
    type,
    id,
    body,
  });
}

module.exports = {
  updateAndConfirmChanges,
};
