
const express = require('express');
const {
  notFoundHandler,
  errorHandler,
} = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const studentProfileRoutes = require('./routes/studentProfileRoutes');

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CPRMP backend is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/student', studentProfileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
