const User = require('../../backend/src/models/User');

describe('User model', () => {
  test('requires name, email, passwordHash, and role', async () => {
    const user = new User({});

    try {
      await user.validate();
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.passwordHash).toBeDefined();
      expect(error.errors.role).toBeDefined();
    }
  });

  test('normalizes email to lowercase and trims whitespace', async () => {
    const user = new User({
      name: 'Test Student',
      email: '  Student@Example.com  ',
      passwordHash: 'test-hash',
      role: 'student',
    });

    await user.validate();

    expect(user.email).toBe('student@example.com');
  });

  test('requires isActive and defaults it to true', async () => {
    const user = new User({
      name: 'Test Student',
      email: 'student@example.com',
      passwordHash: 'test-hash',
      role: 'student',
    });

    expect(user.isActive).toBe(true);
    expect(User.schema.path('isActive').options.required).toBe(true);

    await expect(user.validate()).resolves.toBeUndefined();
  });

  test.each(['student', 'recruiter', 'admin'])(
    'accepts the role %s',
    async (role) => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'test-hash',
        role,
      });

      await expect(user.validate()).resolves.toBeUndefined();
    }
  );

  test('rejects an unsupported role', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'test-hash',
      role: 'superuser',
    });

    await expect(user.validate()).rejects.toThrow();
  });

  test('declares email as unique', () => {
    expect(User.schema.path('email').options.unique).toBe(true);
  });
});