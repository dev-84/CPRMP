
const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../backend/src/middleware/authMiddleware');

const TEST_SECRET = 'test-only-secret-for-jest-do-not-use-in-production';

function createToken(options = {}) {
  return jwt.sign(
    { role: 'student' },
    TEST_SECRET,
    {
      subject: 'integration-test-user',
      issuer: 'cprmp-api',
      audience: 'cprmp-client',
      expiresIn: '1h',
      ...options,
    }
  );
}

function createTestApp() {
  const app = express();

  app.get('/api/protected', authMiddleware, (req, res) => {
    res.status(200).json({
      status: 'ok',
      user: req.user,
    });
  });

  return app;
}

describe('Authentication middleware integration', () => {
  const originalSecret = process.env.JWT_SECRET;
  let app;

  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    app = createTestApp();
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  test('allows access with a valid Bearer token', async () => {
    const token = createToken();

    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      user: {
        id: 'integration-test-user',
        role: 'student',
      },
    });
  });

  test('rejects a request without an authorization header', async () => {
    const response = await request(app).get('/api/protected');

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  test('rejects an invalid token', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid.token.value');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      'Invalid or expired authentication token'
    );
  });

  test('rejects an expired token', async () => {
    const token = createToken({ expiresIn: -1 });

    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      'Invalid or expired authentication token'
    );
  });

  test('does not call the protected handler for an invalid token', async () => {
    const token = jwt.sign(
      { role: 'student' },
      'different-test-secret',
      {
        subject: 'integration-test-user',
        issuer: 'cprmp-api',
        audience: 'cprmp-client',
      }
    );

    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
    expect(response.body).not.toHaveProperty('user');
  });
});
