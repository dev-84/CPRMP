
const RecruitmentStatus = require('../../backend/src/models/RecruitmentStatus');

describe('RecruitmentStatus model', () => {
  test('requires applicationId, status, and changedBy', async () => {
    const record = new RecruitmentStatus({});

    try {
      await record.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.applicationId).toBeDefined();
      expect(error.errors.status).toBeDefined();
      expect(error.errors.changedBy).toBeDefined();
    }
  });

  test('requires changedAt and defaults it to a date', async () => {
    const record = new RecruitmentStatus({
      applicationId: '507f1f77bcf86cd799439011',
      status: 'under_review',
      changedBy: '507f1f77bcf86cd799439012',
    });

    expect(record.changedAt).toBeInstanceOf(Date);
    expect(
      RecruitmentStatus.schema.path('changedAt').options.required
    ).toBe(true);

    await expect(record.validate()).resolves.toBeUndefined();
  });

  test('trims status and note', async () => {
    const record = new RecruitmentStatus({
      applicationId: '507f1f77bcf86cd799439011',
      status: '  under_review  ',
      changedBy: '507f1f77bcf86cd799439012',
      note: '  Application reviewed  ',
    });

    await record.validate();

    expect(record.status).toBe('under_review');
    expect(record.note).toBe('Application reviewed');
  });

  test('declares an index on applicationId', () => {
    const indexes = RecruitmentStatus.schema.indexes();

    expect(
      indexes.some(([fields]) => fields.applicationId === 1)
    ).toBe(true);
  });
});
