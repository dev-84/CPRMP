const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../backend/src/services/studentService', () => ({
  getStudentDashboardData: jest.fn(),
  getStudentDrivesList: jest.fn(),
  getStudentDriveById: jest.fn(),
  applyToDriveForStudent: jest.fn(),
  getStudentApplications: jest.fn(),
  getStudentApplicationDetails: jest.fn(),
  getStudentAIMatching: jest.fn(),
  getStudentPlacementHistory: jest.fn(),
}));

jest.mock('../../backend/src/services/applicationService', () => ({
  applyToPlacementDrive: jest.fn(),
  getStudentApplications: jest.fn(),
}));

const studentService = require('../../backend/src/services/studentService');
const applicationService = require('../../backend/src/services/applicationService');
const app = require('../../backend/src/app');


const JWT_SECRET = 'test-only-secret-for-student-portal';
const STUDENT_ID = '507f1f77bcf86cd799439011';
const RECRUITER_ID = '507f1f77bcf86cd799439012';

function createToken(userId, role = 'student') {
  return jwt.sign({ role }, JWT_SECRET, {
    subject: userId,
    issuer: 'cprmp-api',
    audience: 'cprmp-client',
    expiresIn: '15m',
  });
}

function authHeader(role = 'student') {
  const userId = role === 'recruiter' ? RECRUITER_ID : STUDENT_ID;
  return {
    Authorization: `Bearer ${createToken(userId, role)}`,
  };
}

describe('Student Portal Integration API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = JWT_SECRET;
  });

  describe('Authentication and Role Authorization', () => {
    test('rejects unauthenticated requests to dashboard', async () => {
      const res = await request(app).get('/api/student/dashboard');
      expect(res.status).toBe(401);
    });

    test('rejects recruiter role from student dashboard', async () => {
      const res = await request(app)
        .get('/api/student/dashboard')
        .set(authHeader('recruiter'));
      expect(res.status).toBe(403);
    });

    test('rejects unauthenticated requests to placement drives', async () => {
      const res = await request(app).get('/api/student/drives');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/student/dashboard', () => {
    test('returns student metrics, profile completion, and recommended drives', async () => {
      const mockDashboard = {
        student: {
          fullName: 'Aryan Sharma',
          studentId: 'MCA2024-042',
          degree: 'Master of Computer Applications',
          profileCompletion: 85,
        },
        metrics: {
          availableDrives: 8,
          applicationsSubmitted: 2,
          profileCompletion: 85,
        },
        recommendedDrives: [],
        recentApplications: [],
      };

      studentService.getStudentDashboardData.mockResolvedValue(mockDashboard);

      const res = await request(app)
        .get('/api/student/dashboard')
        .set(authHeader('student'));

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.student.fullName).toBe('Aryan Sharma');
      expect(res.body.data.metrics.profileCompletion).toBe(85);
      expect(studentService.getStudentDashboardData).toHaveBeenCalledWith(STUDENT_ID);
    });
  });

  describe('GET /api/student/drives', () => {
    test('returns published drives with eligibility status', async () => {
      const mockDrives = {
        drives: [
          {
            id: 'drv-001',
            company: 'Microsoft IDC',
            role: 'Software Engineer',
            isEligible: true,
          },
        ],
        totalCount: 1,
      };

      studentService.getStudentDrivesList.mockResolvedValue(mockDrives);

      const res = await request(app)
        .get('/api/student/drives?search=Microsoft')
        .set(authHeader('student'));

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.drives).toHaveLength(1);
      expect(res.body.data.drives[0].company).toBe('Microsoft IDC');
    });
  });

  describe('GET /api/student/drives/:id', () => {
    test('returns single drive details with criteria audit', async () => {
      const mockDrive = {
        drive: { id: '507f1f77bcf86cd799439033', company: 'Google India', role: 'SWE' },
        eligibility: { isEligible: true, criteria: [] },
        hasApplied: false,
      };

      studentService.getStudentDriveById.mockResolvedValue(mockDrive);

      const res = await request(app)
        .get('/api/student/drives/507f1f77bcf86cd799439033')
        .set(authHeader('student'));

      expect(res.status).toBe(200);
      expect(res.body.data.drive.company).toBe('Google India');
    });
  });

  describe('POST /api/student/drives/:id/apply', () => {
    test('successfully applies when candidate has verified resume and is eligible', async () => {
      studentService.applyToDriveForStudent.mockResolvedValue({
        application: { id: 'app-1', status: 'submitted' },
        message: 'Application submitted successfully',
      });

      const res = await request(app)
        .post('/api/student/drives/507f1f77bcf86cd799439033/apply')
        .set(authHeader('student'))
        .send();

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(studentService.applyToDriveForStudent).toHaveBeenCalledWith(
        STUDENT_ID,
        '507f1f77bcf86cd799439033'
      );
    });

    test('returns 400 when service throws missing resume error', async () => {
      const error = new Error('Resume upload is mandatory. Please upload your resume.');
      error.statusCode = 400;
      error.code = 'RESUME_REQUIRED';
      studentService.applyToDriveForStudent.mockRejectedValue(error);

      const res = await request(app)
        .post('/api/student/drives/507f1f77bcf86cd799439033/apply')
        .set(authHeader('student'))
        .send();

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/resume.*mandatory/i);
    });
  });

  describe('GET /api/student/applications', () => {
    test('returns student application tracking list and breakdown', async () => {
      const mockApps = {
        applications: [
          {
            id: 'app-101',
            company: 'TCS Digital',
            role: 'Software Trainee',
            status: 'submitted',
          },
        ],
        summary: { total: 1, submitted: 1 },
      };

      applicationService.getStudentApplications.mockResolvedValue(mockApps);
      studentService.getStudentApplications.mockResolvedValue(mockApps);


      const res = await request(app)
        .get('/api/student/applications')
        .set(authHeader('student'));

      expect(res.status).toBe(200);
      expect(res.body.data.applications).toHaveLength(1);
      expect(res.body.data.summary.total).toBe(1);
    });
  });

  describe('GET /api/student/applications/:id', () => {
    test('returns application details with timeline stages', async () => {
      const mockDetails = {
        application: { id: 'app-101', status: 'shortlisted' },
        stages: [
          { number: 1, title: 'Application Submitted', status: 'completed' },
          { number: 2, title: 'Screening', status: 'current' },
        ],
      };

      studentService.getStudentApplicationDetails.mockResolvedValue(mockDetails);

      const res = await request(app)
        .get('/api/student/applications/app-101')
        .set(authHeader('student'));

      expect(res.status).toBe(200);
      expect(res.body.data.stages).toHaveLength(2);
    });

    test('enforces ownership and returns 403 when viewing another student application', async () => {
      const error = new Error('Access denied: You are not authorized to view this application.');
      error.statusCode = 403;
      studentService.getStudentApplicationDetails.mockRejectedValue(error);

      const res = await request(app)
        .get('/api/student/applications/app-other')
        .set(authHeader('student'));

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });

  describe('GET /api/student/ai-matching', () => {
    test('returns skill-based advisory matching data', async () => {
      const mockAIMatching = {
        matches: [
          {
            id: 'drv-1',
            name: 'Microsoft IDC — SWE',
            score: 88,
            matched: ['Java', 'SQL'],
            missing: ['Kubernetes'],
          },
        ],
        studentSkillsCount: 6,
      };

      studentService.getStudentAIMatching.mockResolvedValue(mockAIMatching);

      const res = await request(app)
        .get('/api/student/ai-matching')
        .set(authHeader('student'));

      expect(res.status).toBe(200);
      expect(res.body.data.matches[0].score).toBe(88);
    });
  });

  describe('GET /api/student/placement-history', () => {
    test('returns official placement history and offer statistics', async () => {
      const mockHistory = {
        records: [
          {
            id: 'rec-1',
            company: 'TCS Digital',
            package: '₹7.50 LPA',
            status: 'Offer Issued',
          },
        ],
        summary: {
          totalOffers: 1,
          highestPackage: '₹7.50 LPA',
          isPlaced: true,
        },
      };

      studentService.getStudentPlacementHistory.mockResolvedValue(mockHistory);

      const res = await request(app)
        .get('/api/student/placement-history')
        .set(authHeader('student'));

      expect(res.status).toBe(200);
      expect(res.body.data.records).toHaveLength(1);
      expect(res.body.data.summary.isPlaced).toBe(true);
    });
  });
});
