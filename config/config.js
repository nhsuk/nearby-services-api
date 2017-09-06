module.exports = {
  es: {
    host: process.env.ES_HOST || 'es',
    port: process.env.ES_PORT || '9200',
    index: process.env.ES_INDEX || 'pharmacies'
  },
};
