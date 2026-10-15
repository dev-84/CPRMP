
const AIMatchResult = require('../../backend/src/models/AIMatchResult');

describe('AIMatchResult model', () => {
  test('requires resumeId and placementDriveId', async () => {
    const result = new AIMatchResult({});

    try {
      await result.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.resumeId).toBeDefined();
      expect(error.errors.placementDriveId).toBeDefined();
    }
  });

  test('defaults skill arrays and generatedAt', () => {
    const result = new AIMatchResult({
      resumeId: '507f1f77bcf86cd799439011',
      placementDriveId: '507f1f77bcf86cd799439012',
    });

    expect(result.matchedSkills).toEqual([]);
    expect(result.missingSkills).toEqual([]);
    expect(result.generatedAt).toBeInstanceOf(Date);
  });

  test('accepts an optional numeric score without assuming a range', async () => {
    for (const score of [-1, 0, 100, 101]) {
      const result = new AIMatchResult({
        resumeId: '507f1f77bcf86cd799439011',
        placementDriveId: '507f1f77bcf86cd799439012',
        score,
      });

      await expect(result.validate()).resolves.toBeUndefined();
    }
  });

  test('trims modelVersion', async () => {
    const result = new AIMatchResult({
      resumeId: '507f1f77bcf86cd799439011',
      placementDriveId: '507f1f77bcf86cd799439012',
      modelVersion: '  v1  ',
    });

    await result.validate();

    expect(result.modelVersion).toBe('v1');
  });
});
