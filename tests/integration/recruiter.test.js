const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../backend/src/services/recruiterService', () => ({
  getRecruiterDashboard: jest.fn(),
  getRecruiterCompany: jest.fn(),
  updateRecruiterCompany: jest.fn(),
  getRecruiterDrives: jest.fn(),
  getRecruiterDriveById: jest.fn(),
  createRecruiterDrive: jest.fn(),
  updateRecruiterDrive: jest.fn(),
  updateRecruiterDriveStatus: jest.fn(),
  getRecruiterApplicants: jest.fn(),
  getRecruiterApplicantById: jest.fn(),
  updateApplicantStatus: jest.fn(),
  bulkUpdateApplicantStatus: jest.fn(),
  getRecruiterShortlistingData: jest.fn(),
  getRecruiterPipelineSummary: jest.fn(),
}));

const recruiterService = require('../../backend/src/services/recruiterService');
const app = require('../../backend/src/app');

describe('Recruiter Portal API Integration Tests', () => {
  const JWT_SECRET = 'test-recruiter-jwt-secret';
  const RECRUITER_ID = '507f1f77bcf86cd799439011';
  const STUDENT_ID = '507f1f77bcf86cd799439022';
  const ADMIN_ID = '507f1f77bcf86cd799439033';

  let recruiterToken;
  let studentToken;
  let adminToken;

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    recruiterToken = jwt.sign(
      { role: 'recruiter' },
      JWT_SECRET,
      { subject: RECRUITER_ID, issuer: 'cprmp-api', audience: 'cprmp-client', expiresIn: '1h', algorithm: 'HS256' }
    );
    studentToken = jwt.sign(
      { role: 'student' },
      JWT_SECRET,
      { subject: STUDENT_ID, issuer: 'cprmp-api', audience: 'cprmp-client', expiresIn: '1h', algorithm: 'HS256' }
    );
    adminToken = jwt.sign(
      { role: 'admin' },
      JWT_SECRET,
      { subject: ADMIN_ID, issuer: 'cprmp-api', audience: 'cprmp-client', expiresIn: '1h', algorithm: 'HS256' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication & Role Authorization', () => {
    test('rejects unauthenticated requests to recruiter dashboard with 401', async () => {
      const res = await request(app).get('/api/recruiter/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });

    test('rejects student role attempting to access recruiter dashboard with 403', async () => {
      const res = await request(app)
        .get('/api/recruiter/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });

    test('allows recruiter role to access dashboard', async () => {
      recruiterService.getRecruiterDashboard.mockResolvedValue({
        company: { name: 'Microsoft IDC' },
        metrics: { totalDrives: 4, totalApplications: 12 },
      });

      const res = await request(app)
        .get('/api/recruiter/dashboard')
        .set('Authorization', `Bearer ${recruiterToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.company.name).toBe('Microsoft IDC');
    });
  });

  describe('Company Profile Management', () => {
    test('GET /api/recruiter/company returns company profile', async () => {
      recruiterService.getRecruiterCompany.mockResolvedValue({
        company: { name: 'Microsoft IDC', industry: 'Cloud' },
        recruiterInfo: { jobTitle: 'Talent Lead' },
      });

      const res = await request(app)
        .get('/api/recruiter/company')
        .set('Authorization', `Bearer ${recruiterToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.company.name).toBe('Microsoft IDC');
    });

    test('PATCH /api/recruiter/company updates permitted fields', async () => {
      recruiterService.updateRecruiterCompany.mockResolvedValue({
        company: { name: 'Microsoft IDC', headquarters: 'Hyderabad, India' },
      });

      const res = await request(app)
        .patch('/api/recruiter/company')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ headquarters: 'Hyderabad, India' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });

  describe('Placement Drives Management', () => {
    test('GET /api/recruiter/drives returns drives list', async () => {
      recruiterService.getRecruiterDrives.mockResolvedValue({
        drives: [{ _id: 'd1', title: 'Software Engineer' }],
        summaryMetrics: { totalDrives: 1, activeDrives: 1 },
      });

      const res = await request(app)
        .get('/api/recruiter/drives')
        .set('Authorization', `Bearer ${recruiterToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.drives).toHaveLength(1);
    });

    test('POST /api/recruiter/drives creates new drive', async () => {
      recruiterService.createRecruiterDrive.mockResolvedValue({
        _id: 'd2',
        title: 'Cloud Architect',
        status: 'draft',
      });

      const res = await request(app)
        .post('/api/recruiter/drives')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Cloud Architect',
          description: 'Design distributed cloud infra',
          applicationDeadline: '2026-12-31',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.drive.title).toBe('Cloud Architect');
    });
  });

  describe('Applicants & Shortlisting', () => {
    test('GET /api/recruiter/applicants returns candidates', async () => {
      recruiterService.getRecruiterApplicants.mockResolvedValue({
        applicants: [{ _id: 'a1', studentName: 'Aryan Sharma', status: 'submitted' }],
      });

      const res = await request(app)
        .get('/api/recruiter/applicants')
        .set('Authorization', `Bearer ${recruiterToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.applicants).toHaveLength(1);
    });

    test('PATCH /api/recruiter/applicants/:id/status updates status', async () => {
      recruiterService.updateApplicantStatus.mockResolvedValue({
        application: { _id: 'a1', status: 'shortlisted' },
      });

      const res = await request(app)
        .patch('/api/recruiter/applicants/a1/status')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'shortlisted', note: 'Strong system design skills' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    test('POST /api/recruiter/applicants/bulk-status performs batch updates', async () => {
      recruiterService.bulkUpdateApplicantStatus.mockResolvedValue({
        updatedCount: 2,
        successfulIds: ['a1', 'a2'],
        errors: [],
      });

      const res = await request(app)
        .post('/api/recruiter/applicants/bulk-status')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ applicationIds: ['a1', 'a2'], status: 'shortlisted' });
      expect(res.status).toBe(200);
      expect(res.body.data.updatedCount).toBe(2);
    });
  });
});
