module.exports = {
  es: {
    host: process.env.ES_HOST || 'es',
    index: process.env.ES_INDEX || 'pharmacies',
    port: process.env.ES_PORT || '9200',
    type: 'pharmacy',
  },
  result: {
    defaults: {
      nearby: 10,
      open: 10,
    },
    limits: {
      nearby: {
        max: process.env.RESULT_LIMIT_NEARBY_MAX || 10,
        min: 1,
      },
      open: {
        max: process.env.RESULT_LIMIT_OPEN_MAX || 10,
        min: 1,
      },
    },
  },
  timezone: 'Europe/London',
};
