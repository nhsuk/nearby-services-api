const express = require('express');

const app = express();
app.port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
