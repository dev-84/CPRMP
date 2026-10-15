
const Company = require('../../backend/src/models/Company');

describe('Company model', () => {
  test('requires name and createdBy', async () => {
    const company = new Company({});

    try {
      await company.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.name).toBeDefined();
      expect(error.errors.createdBy).toBeDefined();
    }
  });

  test('requires status and defaults it to pending', async () => {
    const company = new Company({
      name: 'Example Company',
      createdBy: '507f1f77bcf86cd799439011',
    });

    expect(company.status).toBe('pending');
    expect(Company.schema.path('status').options.required).toBe(true);

    await expect(company.validate()).resolves.toBeUndefined();
  });

  test('trims name and normalizes contactEmail', async () => {
    const company = new Company({
      name: '  Example Company  ',
      contactEmail: '  CONTACT@EXAMPLE.COM  ',
      createdBy: '507f1f77bcf86cd799439011',
    });

    await company.validate();

    expect(company.name).toBe('Example Company');
    expect(company.contactEmail).toBe('contact@example.com');
  });

  test.each(['pending', 'approved', 'rejected', 'inactive'])(
    'accepts the status %s',
    async (status) => {
      const company = new Company({
        name: 'Example Company',
        createdBy: '507f1f77bcf86cd799439011',
        status,
      });

      await expect(company.validate()).resolves.toBeUndefined();
    }
  );

  test('rejects an unsupported status', async () => {
    const company = new Company({
      name: 'Example Company',
      createdBy: '507f1f77bcf86cd799439011',
      status: 'suspended',
    });

    await expect(company.validate()).rejects.toThrow();
  });
});
