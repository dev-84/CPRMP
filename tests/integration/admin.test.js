const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../backend/src/services/adminService', () => ({
  getDashboardStats: jest.fn(),
  getRecentActivity: jest.fn(),
  getUpcomingDrives: jest.fn(),
  getStudents: jest.fn(),
  getStudentById: jest.fn(),
  updateStudentVerification: jest.fn(),
  getRecruiters: jest.fn(),
  createRecruiter: jest.fn(),
  updateRecruiter: jest.fn(),
  getDrives: jest.fn(),
  createDrive: jest.fn(),
  updateDrive: jest.fn(),
  getCompaniesList: jest.fn(),
}));

const adminService = require('../../backend/src/services/adminService');
const app = require('../../backend/src/app');

describe('Admin Management Module API Integration Tests', () => {
  const JWT_SECRET = 'test-only-admin-jwt-secret';
  const ADMIN_ID = '507f1f77bcf86cd799439099';
  const STUDENT_ID = '507f1f77bcf86cd799439098';

  let adminToken;
  let studentToken;

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    adminToken = jwt.sign(
      { role: 'admin' },
      JWT_SECRET,
      { subject: ADMIN_ID, issuer: 'cprmp-api', audience: 'cprmp-client', expiresIn: '1h', algorithm: 'HS256' }
    );
    studentToken = jwt.sign(
      { role: 'student' },
      JWT_SECRET,
      { subject: STUDENT_ID, issuer: 'cprmp-api', audience: 'cprmp-client', expiresIn: '1h', algorithm: 'HS256' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authorization & Security Checks', () => {
    test('rejects unauthenticated requests with 401', async () => {
      const res = await request(app).get('/api/admin/dashboard/stats');
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });

    test('rejects student role attempting to access admin endpoint with 403', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
  });

  describe('Dashboard Endpoints', () => {
    test('GET /api/admin/dashboard/stats returns real stats and charts', async () => {
      adminService.getDashboardStats.mockResolvedValue({
        totalStudents: 8,
        totalRecruiters: 5,
        totalCompanies: 5,
        totalDrives: 5,
        activeDrives: 4,
        totalApplications: 7,
        studentsPlaced: 4,
        studentsWithSignedOffers: 3,
        placementRate: 50,
        verifiedStudents: 6,
        highestPackage: '₹36.0 LPA',
        averagePackage: '₹27.6 LPA',
        charts: {
          studentsByProgram: [{ program: 'MCA', count: 3 }],
          applicationsByStatus: [{ status: 'selected', count: 4 }],
          drivesByStatus: [{ status: 'published', count: 4 }],
        },
      });

      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.totalStudents).toBe(8);
      expect(res.body.data.studentsWithSignedOffers).toBe(3);
    });

    test('GET /api/admin/dashboard/recent-activity returns activity items', async () => {
      adminService.getRecentActivity.mockResolvedValue([
        { id: 'app-1', type: 'application', title: 'New Application', description: 'Applied', timestamp: new Date() },
      ]);

      const res = await request(app)
        .get('/api/admin/dashboard/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    test('GET /api/admin/dashboard/upcoming-drives returns active drives', async () => {
      adminService.getUpcomingDrives.mockResolvedValue([
        { id: 'drv-1', company: 'Microsoft IDC', role: 'SWE', salary: '₹32.0 LPA' },
      ]);

      const res = await request(app)
        .get('/api/admin/dashboard/upcoming-drives')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('Student Management Endpoints', () => {
    test('GET /api/admin/students returns paginated students and 4 summary cards', async () => {
      adminService.getStudents.mockResolvedValue({
        students: [
          {
            id: 'std-1',
            name: 'Aryan Sharma',
            rollNo: 'MCA2024-042',
            program: 'MCA',
            cgpa: 8.84,
            activeBacklogs: 0,
            offerLetterSigned: 'Yes',
            placementStatus: 'Placed (Signed)',
          },
        ],
        pagination: { totalRecords: 1, totalPages: 1, currentPage: 1, pageSize: 10 },
        summaryCards: {
          totalStudents: 8,
          programBreakdown: [{ program: 'MCA', count: 3 }],
          signedOfferLetters: 3,
          studentsWithActiveBacklogs: 2,
          studentsWithZeroBacklogs: 6,
        },
      });

      const res = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.students.length).toBe(1);
      expect(res.body.data.summaryCards.signedOfferLetters).toBe(3);
    });

    test('GET /api/admin/students/:id returns single student details', async () => {
      adminService.getStudentById.mockResolvedValue({
        id: 'std-1',
        fullName: 'Aryan Sharma',
        studentId: 'MCA2024-042',
        degree: 'MCA',
        cgpa: 8.84,
      });

      const res = await request(app)
        .get('/api/admin/students/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.studentId).toBe('MCA2024-042');
    });

    test('PATCH /api/admin/students/:id/status updates student verification', async () => {
      adminService.updateStudentVerification.mockResolvedValue({
        id: 'std-1',
        placementVerificationStatus: 'verified',
      });

      const res = await request(app)
        .patch('/api/admin/students/507f1f77bcf86cd799439011/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ placementVerificationStatus: 'verified' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(adminService.updateStudentVerification).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { placementVerificationStatus: 'verified' }
      );
    });
  });

  describe('Recruiters Management Endpoints', () => {
    test('GET /api/admin/recruiters returns recruiters and metrics', async () => {
      adminService.getRecruiters.mockResolvedValue({
        recruiters: [
          { id: 'rec-1', name: 'Aditi Rao', email: 'aditi@microsoft.com', company: 'Microsoft IDC' },
        ],
        pagination: { totalRecords: 1, totalPages: 1, currentPage: 1, pageSize: 10 },
        metrics: {
          totalRecruiters: 5,
          activeRecruiters: 5,
          pendingVerification: 1,
          companiesRepresented: 5,
        },
      });

      const res = await request(app)
        .get('/api/admin/recruiters')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.recruiters.length).toBe(1);
      expect(res.body.data.metrics.totalRecruiters).toBe(5);
    });

    test('POST /api/admin/recruiters creates a new recruiter account', async () => {
      adminService.createRecruiter.mockResolvedValue({
        user: { _id: 'u-1', email: 'new.recruiter@amazon.com' },
        profile: { _id: 'p-1', jobTitle: 'Talent Lead' },
      });

      const res = await request(app)
        .post('/api/admin/recruiters')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Rohit Verma',
          email: 'new.recruiter@amazon.com',
          password: 'Password123!',
          companyName: 'Amazon India',
          jobTitle: 'Talent Lead',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
    });
  });

  describe('Placement Drives Endpoints', () => {
    test('GET /api/admin/drives returns drives and summary metrics', async () => {
      adminService.getDrives.mockResolvedValue({
        drives: [
          { id: 'drv-1', title: 'Software Engineer', company: 'Microsoft IDC', status: 'published' },
        ],
        pagination: { totalRecords: 1, totalPages: 1, currentPage: 1, pageSize: 10 },
        metrics: {
          totalDrives: 5,
          publishedDrives: 4,
          draftDrives: 0,
          closedDrives: 1,
          totalApplications: 7,
        },
      });

      const res = await request(app)
        .get('/api/admin/drives')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.drives.length).toBe(1);
    });

    test('POST /api/admin/drives creates a new drive', async () => {
      adminService.createDrive.mockResolvedValue({
        drive: { _id: 'drv-2', title: 'Data Engineer' },
        criteria: { minimumCgpa: 7.5 },
      });

      const res = await request(app)
        .post('/api/admin/drives')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Data Engineer',
          description: 'Big data pipelines',
          companyName: 'Microsoft IDC',
          salary: '₹22.0 LPA',
          applicationDeadline: '2026-11-30',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
    });

    test('GET /api/admin/companies returns companies list', async () => {
      adminService.getCompaniesList.mockResolvedValue([
        { _id: 'c-1', name: 'Microsoft IDC' },
        { _id: 'c-2', name: 'Google India' },
      ]);

      const res = await request(app)
        .get('/api/admin/companies')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.length).toBe(2);
    });
  });
});
