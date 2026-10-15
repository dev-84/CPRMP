
const Application = require('../../backend/src/models/Application');

describe('Application model', () => {
  test('requires studentProfileId and placementDriveId but allows resumeId to be omitted', async () => {
    const application = new Application({});

    try {
      await application.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.studentProfileId).toBeDefined();
      expect(error.errors.placementDriveId).toBeDefined();
      expect(error.errors.resumeId).toBeUndefined();
    }

    const applicationWithoutResume = new Application({
      studentProfileId: '507f1f77bcf86cd799439011',
      placementDriveId: '507f1f77bcf86cd799439012',
    });

    await expect(
      applicationWithoutResume.validate()
    ).resolves.toBeUndefined();
  });

  test('declares an index on placementDriveId', () => {
    const indexes = Application.schema.indexes();

    expect(
      indexes.some(
        ([fields]) =>
          fields.placementDriveId === 1 &&
          Object.keys(fields).length === 1
      )
    ).toBe(true);
  });

  test('requires statuses and defaults them, and defaults appliedAt', async () => {
    const application = new Application({
      studentProfileId: '507f1f77bcf86cd799439011',
      placementDriveId: '507f1f77bcf86cd799439012',
    });

    expect(application.status).toBe('submitted');
    expect(application.eligibilityStatus).toBe('pending');
    expect(application.appliedAt).toBeInstanceOf(Date);

    expect(Application.schema.path('status').options.required).toBe(true);
    expect(
      Application.schema.path('eligibilityStatus').options.required
    ).toBe(true);

    await expect(application.validate()).resolves.toBeUndefined();
  });

  test('rejects unsupported application status', async () => {
    const application = new Application({
      studentProfileId: '507f1f77bcf86cd799439011',
      placementDriveId: '507f1f77bcf86cd799439012',
      status: 'unknown',
    });

    await expect(application.validate()).rejects.toThrow();
  });

  test('rejects unsupported eligibility status', async () => {
    const application = new Application({
      studentProfileId: '507f1f77bcf86cd799439011',
      placementDriveId: '507f1f77bcf86cd799439012',
      resumeId: '507f1f77bcf86cd799439013',
      eligibilityStatus: 'unknown',
    });

    await expect(application.validate()).rejects.toThrow();
  });

  test('declares a unique student-and-drive index', () => {
    const indexes = Application.schema.indexes();

    expect(
      indexes.some(
        ([fields, options]) =>
          fields.studentProfileId === 1 &&
          fields.placementDriveId === 1 &&
          options.unique === true
      )
    ).toBe(true);
  });
});
