const StudentProfile = require('../../backend/src/models/StudentProfile');

describe('StudentProfile model', () => {
  test('requires userId, studentId, department, degree, and graduationYear', async () => {
    const profile = new StudentProfile({});

    try {
      await profile.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.userId).toBeDefined();
      expect(error.errors.studentId).toBeDefined();
      expect(error.errors.department).toBeDefined();
      expect(error.errors.degree).toBeDefined();
      expect(error.errors.graduationYear).toBeDefined();
    }
  });

  test('trims studentId and text fields', async () => {
    const profile = new StudentProfile({
      userId: '507f1f77bcf86cd799439011',
      studentId: '  STU-001  ',
      phone: '  1234567890  ',
      department: '  Computer Science  ',
      degree: '  B.Tech  ',
      graduationYear: 2030,
    });

    await profile.validate();

    expect(profile.studentId).toBe('STU-001');
    expect(profile.phone).toBe('1234567890');
    expect(profile.department).toBe('Computer Science');
    expect(profile.degree).toBe('B.Tech');
  });

  test('defaults backlogCount to zero and skills to an empty array', () => {
    const profile = new StudentProfile({
      userId: '507f1f77bcf86cd799439011',
      studentId: 'STU-002',
      department: 'Computer Science',
      degree: 'B.Tech',
      graduationYear: 2030,
    });

    expect(profile.backlogCount).toBe(0);
    expect(profile.skills).toEqual([]);
  });

  test('declares userId and studentId as unique', () => {
    expect(StudentProfile.schema.path('userId').options.unique).toBe(true);
    expect(StudentProfile.schema.path('studentId').options.unique).toBe(true);
  });

  test('rejects a negative backlogCount', async () => {
    const profile = new StudentProfile({
      userId: '507f1f77bcf86cd799439011',
      studentId: 'STU-003',
      department: 'Computer Science',
      degree: 'B.Tech',
      graduationYear: 2030,
      backlogCount: -1,
    });

    await expect(profile.validate()).rejects.toThrow();
  });
});