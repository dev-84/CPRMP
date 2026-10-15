const RecruiterProfile = require('../../backend/src/models/RecruiterProfile');

describe('RecruiterProfile model', () => {
  test('requires userId but allows companyId to be omitted', async () => {
    const profile = new RecruiterProfile({});

    try {
      await profile.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.userId).toBeDefined();
      expect(error.errors.companyId).toBeUndefined();
    }

    const onboardingProfile = new RecruiterProfile({
      userId: '507f1f77bcf86cd799439011',
    });

    await expect(onboardingProfile.validate()).resolves.toBeUndefined();
  });

  test('requires isVerified and defaults it to false', async () => {
    const profile = new RecruiterProfile({
      userId: '507f1f77bcf86cd799439011',
    });

    expect(profile.isVerified).toBe(false);
    expect(RecruiterProfile.schema.path('isVerified').options.required).toBe(true);

    await expect(profile.validate()).resolves.toBeUndefined();
  });

  test('trims jobTitle and phone', async () => {
    const profile = new RecruiterProfile({
      userId: '507f1f77bcf86cd799439011',
      companyId: '507f1f77bcf86cd799439012',
      jobTitle: '  HR Manager  ',
      phone: '  1234567890  ',
    });

    await profile.validate();

    expect(profile.jobTitle).toBe('HR Manager');
    expect(profile.phone).toBe('1234567890');
  });

  test('declares userId as unique', () => {
    expect(RecruiterProfile.schema.path('userId').options.unique).toBe(true);
  });
});
