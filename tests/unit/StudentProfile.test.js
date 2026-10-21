
const StudentProfile = require('../../backend/src/models/StudentProfile');

const validProfile = {
  userId: '507f1f77bcf86cd799439011',
  studentId: 'STU-001',
  department: 'Computer Science',
  degree: 'MCA',
  graduationYear: 2027,
};

function createProfile(overrides = {}) {
  return new StudentProfile({
    ...validProfile,
    ...overrides,
  });
}

describe('StudentProfile model', () => {
  test('requires userId, studentId, department, degree, and graduationYear', async () => {
    const profile = new StudentProfile({});

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });

    try {
      await profile.validate();
    } catch (error) {
      expect(error.errors.userId).toBeDefined();
      expect(error.errors.studentId).toBeDefined();
      expect(error.errors.department).toBeDefined();
      expect(error.errors.degree).toBeDefined();
      expect(error.errors.graduationYear).toBeDefined();
    }
  });

  test('trims studentId and text fields', async () => {
    const profile = createProfile({
      studentId: '  STU-001  ',
      phone: '  1234567890  ',
      department: '  Computer Science  ',
      degree: '  B.Tech  ',
    });

    await profile.validate();

    expect(profile.studentId).toBe('STU-001');
    expect(profile.phone).toBe('1234567890');
    expect(profile.department).toBe('Computer Science');
    expect(profile.degree).toBe('B.Tech');
  });

  test('defaults backlogCount to zero and skills to an empty array', () => {
    const profile = createProfile();

    expect(profile.backlogCount).toBe(0);
    expect(profile.skills).toEqual([]);
  });

  test('declares userId and studentId as unique', () => {
    expect(StudentProfile.schema.path('userId').options.unique).toBe(true);
    expect(StudentProfile.schema.path('studentId').options.unique).toBe(true);
  });

  test('rejects a negative backlogCount', async () => {
    const profile = createProfile({ backlogCount: -1 });

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });

  test('rejects a non-integer backlogCount', async () => {
    const profile = createProfile({ backlogCount: 1.5 });

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });

  test('rejects a CGPA greater than 10', async () => {
    const profile = createProfile({ cgpa: 10.1 });

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });

  test('accepts a CGPA of 10', async () => {
    const profile = createProfile({ cgpa: 10 });

    await expect(profile.validate()).resolves.toBeUndefined();
  });

  test('rejects a current semester greater than 20', async () => {
    const profile = createProfile({ currentSemester: 21 });

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });

  test('rejects a non-integer current semester', async () => {
    const profile = createProfile({ currentSemester: 3.5 });

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });

  test('rejects a graduation year greater than 2200', async () => {
    const profile = createProfile({ graduationYear: 2201 });

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });

  test('rejects a non-integer graduation year', async () => {
    const profile = createProfile({ graduationYear: 2027.5 });

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });

  test('rejects more than 100 skills', async () => {
    const skills = Array.from({ length: 101 }, (_, index) => `Skill-${index}`);

    const profile = createProfile({ skills });

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });

  test('rejects a skill name longer than 50 characters', async () => {
    const profile = createProfile({
      skills: ['A'.repeat(51)],
    });

    await expect(profile.validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });

  test('trims skill names', async () => {
    const profile = createProfile({
      skills: [' JavaScript ', ' React '],
    });

    await profile.validate();

    expect(profile.skills).toEqual(['JavaScript', 'React']);
  });
});
