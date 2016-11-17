const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());

app.port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

module.exports = app;
