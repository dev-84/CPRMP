
const PlacementHistory = require('../../backend/src/models/PlacementHistory');

describe('PlacementHistory model', () => {
  test('requires placement references but allows jobTitle to be omitted', async () => {
    const history = new PlacementHistory({});

    try {
      await history.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.studentProfileId).toBeDefined();
      expect(error.errors.applicationId).toBeDefined();
      expect(error.errors.companyId).toBeDefined();
      expect(error.errors.placementDriveId).toBeDefined();
      expect(error.errors.jobTitle).toBeUndefined();
      expect(error.errors.placedAt).toBeDefined();
    }
  });

  test('allows jobTitle to be omitted', async () => {
    const history = new PlacementHistory({
      studentProfileId: '507f1f77bcf86cd799439011',
      applicationId: '507f1f77bcf86cd799439012',
      companyId: '507f1f77bcf86cd799439013',
      placementDriveId: '507f1f77bcf86cd799439014',
      placedAt: new Date('2030-01-01'),
    });

    await expect(history.validate()).resolves.toBeUndefined();

    expect(
      PlacementHistory.schema.path('placedAt').options.required
    ).toBe(true);
  });

  test('trims jobTitle and normalizes packageCurrency', async () => {
    const history = new PlacementHistory({
      studentProfileId: '507f1f77bcf86cd799439011',
      applicationId: '507f1f77bcf86cd799439012',
      companyId: '507f1f77bcf86cd799439013',
      placementDriveId: '507f1f77bcf86cd799439014',
      jobTitle: '  Software Engineer  ',
      packageAmount: 1200000,
      packageCurrency: '  inr  ',
      placedAt: new Date('2030-01-01'),
    });

    await history.validate();

    expect(history.jobTitle).toBe('Software Engineer');
    expect(history.packageCurrency).toBe('INR');
  });

  test('rejects a negative packageAmount', async () => {
    const history = new PlacementHistory({
      studentProfileId: '507f1f77bcf86cd799439011',
      applicationId: '507f1f77bcf86cd799439012',
      companyId: '507f1f77bcf86cd799439013',
      placementDriveId: '507f1f77bcf86cd799439014',
      jobTitle: 'Software Engineer',
      packageAmount: -1,
      placedAt: new Date('2030-01-01'),
    });

    await expect(history.validate()).rejects.toThrow();
  });

  test('declares applicationId as unique', () => {
    expect(
      PlacementHistory.schema.path('applicationId').options.unique
    ).toBe(true);
  });
});
