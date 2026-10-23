const request = require('supertest');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const app = require('../../backend/src/app');
const Resume = require('../../backend/src/models/Resume');
const StudentProfile = require('../../backend/src/models/StudentProfile');
const Application = require('../../backend/src/models/Application');
const PlacementDrive = require('../../backend/src/models/PlacementDrive');
const { RESUME_DIR } = require('../../backend/src/middleware/resumeUpload');

const JWT_SECRET = 'test-only-secret-for-resume';
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

describe('Resume Management & Mandatory Validation API', () => {
  let createdFiles = [];

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  afterEach(() => {
    // Clean up test files created in RESUME_DIR
    for (const f of createdFiles) {
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch {}
      }
    }
    createdFiles = [];
    jest.clearAllMocks();
  });

  describe('Authentication & Authorization', () => {
    test('rejects unauthenticated requests to GET /api/student/resume', async () => {
      const res = await request(app).get('/api/student/resume');
      expect(res.status).toBe(401);
    });

    test('rejects recruiter from uploading to student resume endpoint', async () => {
      const res = await request(app)
        .post('/api/student/resume')
        .set(authHeader('recruiter'));
      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/student/resume status endpoint', () => {
    test('returns hasResume: false when student has no resume on record', async () => {
      // Mock student profile with no resumes
      jest.spyOn(StudentProfile, 'findOne').mockResolvedValue({
        _id: '507f1f77bcf86cd799439020',
        userId: STUDENT_ID,
      });

      jest.spyOn(Resume, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      });

      jest.spyOn(Resume, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      const res = await request(app)
        .get('/api/student/resume')
        .set(authHeader());

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.hasResume).toBe(false);
      expect(res.body.data.resume).toBeNull();
      expect(Array.isArray(res.body.data.archive)).toBe(true);
    });
  });

  describe('POST /api/student/resume upload validation', () => {
    test('rejects request when no file is attached (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/student/resume')
        .set(authHeader());

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/provide a.*resume/i);
    });

    test('rejects non-PDF files such as .txt or .png (415 Unsupported Media Type)', async () => {
      const res = await request(app)
        .post('/api/student/resume')
        .set(authHeader())
        .attach('resume', Buffer.from('Plain text file'), 'notes.txt');

      expect([400, 415]).toContain(res.status);
      expect(res.body.message).toMatch(/pdf/i);
    });

    test('rejects invalid/corrupted PDF that fails %PDF- magic signature', async () => {
      // Name is .pdf, but buffer doesn't start with %PDF-
      const invalidPdfBuffer = Buffer.from('NOT A REAL PDF CONTENT');

      const res = await request(app)
        .post('/api/student/resume')
        .set(authHeader())
        .attach('resume', invalidPdfBuffer, 'fake.pdf');

      expect([400, 415]).toContain(res.status);
      expect(res.body.message).toMatch(/pdf/i);
    });

    test('accepts authentic PDF file with %PDF- header and saves active resume', async () => {
      const validPdfBuffer = Buffer.from('%PDF-1.4 sample valid test document content');

      const mockProfile = {
        _id: '507f1f77bcf86cd799439020',
        userId: STUDENT_ID,
      };

      jest.spyOn(StudentProfile, 'findOne').mockResolvedValue(mockProfile);
      jest.spyOn(StudentProfile, 'create').mockResolvedValue(mockProfile);
      jest.spyOn(StudentProfile, 'findByIdAndUpdate').mockResolvedValue(mockProfile);
      jest.spyOn(Resume, 'updateMany').mockResolvedValue({ acknowledged: true });
      jest.spyOn(Resume, 'create').mockImplementation((data) => ({
        _id: '507f1f77bcf86cd799439099',
        ...data,
      }));

      const res = await request(app)
        .post('/api/student/resume')
        .set(authHeader())
        .attach('resume', validPdfBuffer, 'Aryan_Sharma_MCA_Resume.pdf');

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.resume.filename).toBe('Aryan_Sharma_MCA_Resume.pdf');
    });
  });

  describe('GET /api/student/resume/preview functional preview', () => {
    test('returns 404 when candidate has no active resume', async () => {
      jest.spyOn(StudentProfile, 'findOne').mockResolvedValue({
        _id: '507f1f77bcf86cd799439020',
        userId: STUDENT_ID,
      });

      jest.spyOn(Resume, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app)
        .get('/api/student/resume/preview')
        .set(authHeader());

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/no active resume/i);
    });

    test('streams real PDF file inline with Content-Disposition inline', async () => {
      // Create a dummy physical file in RESUME_DIR
      const testFilename = `test-preview-${Date.now()}.pdf`;
      const testFilePath = path.join(RESUME_DIR, testFilename);
      fs.writeFileSync(testFilePath, '%PDF-1.4 test preview stream content');
      createdFiles.push(testFilePath);

      const mockProfile = {
        _id: '507f1f77bcf86cd799439020',
        userId: STUDENT_ID,
      };

      const mockResume = {
        _id: '507f1f77bcf86cd799439099',
        studentProfileId: mockProfile._id,
        originalFilename: 'Aryan_Sharma_Placement_Resume.pdf',
        storageKey: testFilename,
        mimeType: 'application/pdf',
        sizeBytes: 35,
        isActive: true,
      };

      jest.spyOn(StudentProfile, 'findOne').mockResolvedValue(mockProfile);
      jest.spyOn(Resume, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockResume),
      });

      const res = await request(app)
        .get('/api/student/resume/preview')
        .set(authHeader());

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/pdf/);
      expect(res.headers['content-disposition']).toMatch(/inline/);
      const textOutput = Buffer.isBuffer(res.body) ? res.body.toString('utf8') : res.text;
      expect(textOutput).toContain('%PDF-1.4');
    });
  });

  describe('Mandatory Resume Verification for Applications', () => {
    test('rejects placement drive application if candidate has NO active resume', async () => {
      const mockProfile = {
        _id: '507f1f77bcf86cd799439020',
        userId: STUDENT_ID,
      };

      jest.spyOn(StudentProfile, 'findOne').mockResolvedValue(mockProfile);
      jest.spyOn(Resume, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(null), // NO RESUME!
      });

      const res = await request(app)
        .post('/api/applications/apply')
        .set(authHeader())
        .send({ driveId: '507f1f77bcf86cd799439033' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/resume.*required/i);
    });

    test('allows placement application when candidate HAS an active verified resume', async () => {
      const testFilename = `test-app-${Date.now()}.pdf`;
      const testFilePath = path.join(RESUME_DIR, testFilename);
      fs.writeFileSync(testFilePath, '%PDF-1.4 application test');
      createdFiles.push(testFilePath);

      const mockProfile = {
        _id: '507f1f77bcf86cd799439020',
        userId: STUDENT_ID,
      };

      const mockResume = {
        _id: '507f1f77bcf86cd799439099',
        studentProfileId: mockProfile._id,
        originalFilename: 'Verified_Resume.pdf',
        storageKey: testFilename,
        isActive: true,
      };

      jest.spyOn(StudentProfile, 'findOne').mockResolvedValue(mockProfile);
      jest.spyOn(Resume, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockResume),
      });
      jest.spyOn(PlacementDrive, 'findById').mockResolvedValue(null);
      jest.spyOn(Application, 'findOne').mockResolvedValue(null);
      jest.spyOn(Application, 'create').mockImplementation((data) => ({
        _id: 'app-999',
        ...data,
      }));

      const res = await request(app)
        .post('/api/applications/apply')
        .set(authHeader())
        .send({ driveId: '507f1f77bcf86cd799439033' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.resume.id).toBe('507f1f77bcf86cd799439099');
    });
  });
});
