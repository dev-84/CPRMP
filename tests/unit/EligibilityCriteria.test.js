
const EligibilityCriteria = require('../../backend/src/models/EligibilityCriteria');

describe('EligibilityCriteria model', () => {
  test('requires placementDriveId', async () => {
    const criteria = new EligibilityCriteria({});

    try {
      await criteria.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.placementDriveId).toBeDefined();
    }
  });

  test('accepts valid boundary values', async () => {
    const criteria = new EligibilityCriteria({
      placementDriveId: '507f1f77bcf86cd799439011',
      minimumCgpa: 0,
      maximumBacklogs: 0,
      graduationYears: [2028, 2029],
    });

    await expect(criteria.validate()).resolves.toBeUndefined();
  });

  test('declares placementDriveId as unique', () => {
    expect(
      EligibilityCriteria.schema.path('placementDriveId').options.unique
    ).toBe(true);
  });

  test('defaults list fields to empty arrays', () => {
    const criteria = new EligibilityCriteria({
      placementDriveId: '507f1f77bcf86cd799439011',
    });

    expect(criteria.allowedDepartments).toEqual([]);
    expect(criteria.allowedDegrees).toEqual([]);
    expect(criteria.graduationYears).toEqual([]);
    expect(criteria.requiredSkills).toEqual([]);
    expect(criteria.additionalRules).toEqual([]);
  });

  test('rejects a negative minimumCgpa', async () => {
    const criteria = new EligibilityCriteria({
      placementDriveId: '507f1f77bcf86cd799439011',
      minimumCgpa: -1,
    });

    await expect(criteria.validate()).rejects.toThrow();
  });

  test('rejects negative or fractional maximumBacklogs', async () => {
    for (const value of [-1, 1.5]) {
      const criteria = new EligibilityCriteria({
        placementDriveId: '507f1f77bcf86cd799439011',
        maximumBacklogs: value,
      });

      await expect(criteria.validate()).rejects.toThrow();
    }
  });

  test('rejects invalid graduation years', async () => {
    const criteria = new EligibilityCriteria({
      placementDriveId: '507f1f77bcf86cd799439011',
      graduationYears: [2028, 1899, 2029.5],
    });

    await expect(criteria.validate()).rejects.toThrow();
  });
});
