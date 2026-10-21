
const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../backend/src/services/studentProfileService', () => ({
  createStudentProfile: jest.fn(),
  getStudentProfile: jest.fn(),
  updateStudentProfile: jest.fn(),
}));

const studentProfileService = require('../../backend/src/services/studentProfileService');
const app = require('../../backend/src/app');

const JWT_SECRET = 'test-only-secret-for-student-profile';
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

const validProfile = {
  studentId: 'STU-001',
  department: 'Computer Science',
  degree: 'MCA',
  graduationYear: 2027,
};

describe('Student Profile API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = JWT_SECRET;
  });

  describe('Authentication and role protection', () => {
    test('rejects requests without a token', async () => {
      const response = await request(app).get('/api/student/profile');

      expect(response.status).toBe(401);
      expect(studentProfileService.getStudentProfile).not.toHaveBeenCalled();
    });

    test('rejects recruiter access to student profile APIs', async () => {
      const response = await request(app)
        .get('/api/student/profile')
        .set(authHeader('recruiter'));

      expect(response.status).toBe(403);
      expect(studentProfileService.getStudentProfile).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/student/profile', () => {
    test('creates a valid profile and returns 201', async () => {
      studentProfileService.createStudentProfile.mockResolvedValue({
        id: 'profile-001',
        userId: STUDENT_ID,
        ...validProfile,
        backlogCount: 0,
        skills: [],
      });

      const response = await request(app)
        .post('/api/student/profile')
        .set(authHeader())
        .send(validProfile);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.profile.studentId).toBe('STU-001');

      expect(studentProfileService.createStudentProfile).toHaveBeenCalledWith(
        STUDENT_ID,
        validProfile
      );
    });

    test('rejects missing required fields', async () => {
      const response = await request(app)
        .post('/api/student/profile')
        .set(authHeader())
        .send({ studentId: 'STU-002' });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(studentProfileService.createStudentProfile).not.toHaveBeenCalled();
    });

    test('rejects invalid CGPA', async () => {
      const response = await request(app)
        .post('/api/student/profile')
        .set(authHeader())
        .send({
          ...validProfile,
          cgpa: 12,
        });

      expect(response.status).toBe(400);
      expect(studentProfileService.createStudentProfile).not.toHaveBeenCalled();
    });

    test('does not allow client-supplied userId', async () => {
      const response = await request(app)
        .post('/api/student/profile')
        .set(authHeader())
        .send({
          ...validProfile,
          userId: RECRUITER_ID,
        });

      expect(response.status).toBe(400);
      expect(studentProfileService.createStudentProfile).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/student/profile', () => {
    test('returns the authenticated student profile', async () => {
      studentProfileService.getStudentProfile.mockResolvedValue({
        id: 'profile-001',
        userId: STUDENT_ID,
        ...validProfile,
      });

      const response = await request(app)
        .get('/api/student/profile')
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.data.profile.userId).toBe(STUDENT_ID);
      expect(studentProfileService.getStudentProfile).toHaveBeenCalledWith(
        STUDENT_ID
      );
    });

    test('returns 404 when the profile does not exist', async () => {
      studentProfileService.getStudentProfile.mockRejectedValue(
        Object.assign(new Error('Student profile not found'), {
          statusCode: 404,
        })
      );

      const response = await request(app)
        .get('/api/student/profile')
        .set(authHeader());

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student profile not found');
    });
  });

  describe('PATCH /api/student/profile', () => {
    test('updates profile fields and returns 200', async () => {
      studentProfileService.updateStudentProfile.mockResolvedValue({
        id: 'profile-001',
        userId: STUDENT_ID,
        ...validProfile,
        department: 'Information Technology',
      });

      const response = await request(app)
        .patch('/api/student/profile')
        .set(authHeader())
        .send({
          department: 'Information Technology',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.profile.department).toBe(
        'Information Technology'
      );
      expect(studentProfileService.updateStudentProfile).toHaveBeenCalledWith(
        STUDENT_ID,
        { department: 'Information Technology' }
      );
    });

    test('rejects an empty update body', async () => {
      const response = await request(app)
        .patch('/api/student/profile')
        .set(authHeader())
        .send({});

      expect(response.status).toBe(400);
      expect(studentProfileService.updateStudentProfile).not.toHaveBeenCalled();
    });
  });
});
