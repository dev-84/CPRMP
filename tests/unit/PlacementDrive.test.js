
const PlacementDrive = require('../../backend/src/models/PlacementDrive');

describe('PlacementDrive model', () => {
  test('requires companyId, createdBy, title, description, and applicationDeadline', async () => {
    const drive = new PlacementDrive({});

    try {
      await drive.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.companyId).toBeDefined();
      expect(error.errors.createdBy).toBeDefined();
      expect(error.errors.title).toBeDefined();
      expect(error.errors.description).toBeDefined();
      expect(error.errors.applicationDeadline).toBeDefined();
      expect(error.errors.jobType).toBeUndefined();
    }
  });

  test('declares an index on companyId', () => {
    const indexes = PlacementDrive.schema.indexes();

    expect(
      indexes.some(([fields]) => fields.companyId === 1)
    ).toBe(true);
  });

  test('requires status and defaults it to draft', async () => {
    const drive = new PlacementDrive({
      companyId: '507f1f77bcf86cd799439011',
      createdBy: '507f1f77bcf86cd799439012',
      title: 'Software Engineer',
      description: 'Entry-level software role',
      applicationDeadline: new Date('2030-12-31'),
    });

    expect(drive.status).toBe('draft');
    expect(PlacementDrive.schema.path('status').options.required).toBe(true);

    await expect(drive.validate()).resolves.toBeUndefined();
  });

  test('trims title, description, jobType, and location', async () => {
    const drive = new PlacementDrive({
      companyId: '507f1f77bcf86cd799439011',
      createdBy: '507f1f77bcf86cd799439012',
      title: '  Software Engineer  ',
      description: '  Entry-level role  ',
      jobType: '  Full-time  ',
      location: '  Vadodara  ',
      applicationDeadline: new Date('2030-12-31'),
    });

    await drive.validate();

    expect(drive.title).toBe('Software Engineer');
    expect(drive.description).toBe('Entry-level role');
    expect(drive.jobType).toBe('Full-time');
    expect(drive.location).toBe('Vadodara');
  });

  test('rejects an unsupported status', async () => {
    const drive = new PlacementDrive({
      companyId: '507f1f77bcf86cd799439011',
      createdBy: '507f1f77bcf86cd799439012',
      title: 'Software Engineer',
      description: 'Entry-level software role',
      jobType: 'Full-time',
      applicationDeadline: new Date('2030-12-31'),
      status: 'unknown',
    });

    await expect(drive.validate()).rejects.toThrow();
  });
});
