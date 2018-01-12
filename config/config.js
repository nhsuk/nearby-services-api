module.exports = {
  es: {
    host: process.env.ES_HOST || 'es',
    port: process.env.ES_PORT || '9200',
    index: process.env.ES_INDEX || 'pharmacies',
    type: 'pharmacy',
  },
  resultLimits: {
    open: {
      min: 1,
      max: process.env.RESULT_LIMIT_OPEN_MAX || 10,
    },
    nearby: {
      min: 1,
      max: process.env.RESULT_LIMIT_NEARBY_MAX || 10,
    },
  },
  timezone: 'Europe/London'
};
