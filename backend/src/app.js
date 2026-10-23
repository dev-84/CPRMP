
const express = require('express');
const {
  notFoundHandler,
  errorHandler,
} = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const studentProfileRoutes = require('./routes/studentProfileRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CPRMP backend is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/student/resume', resumeRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/student/applications', applicationRoutes);
app.use('/api/student', studentProfileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/v1/recruiter', recruiterRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
