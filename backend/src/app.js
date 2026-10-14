
const express = require('express');
const {
  notFoundHandler,
  errorHandler,
} = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CPRMP backend is running',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
