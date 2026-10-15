
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../backend/src/middleware/authMiddleware');

const TEST_SECRET = 'test-only-secret-for-jest-do-not-use-in-production';

function makeRequest(authorization) {
  return {
    get: jest.fn().mockReturnValue(authorization),
  };
}

function makeResponse() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };

  res.status.mockReturnValue(res);
  return res;
}


function makeToken(payload = {}, options = {}) {
  const { secret = TEST_SECRET, ...signOptions } = options;

  return jwt.sign(
    {
      role: 'student',
      ...payload,
    },
    secret,
    {
      subject: 'test-user-id',
      issuer: 'cprmp-api',
      audience: 'cprmp-client',
      expiresIn: '1h',
      ...signOptions,
    }
  );
}


describe('authMiddleware', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  test('accepts a valid token and attaches user identity', () => {
    const token = makeToken();
    const req = makeRequest(`Bearer ${token}`);
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user).toEqual({
      id: 'test-user-id',
      role: 'student',
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('rejects a missing token', () => {
    const req = makeRequest(undefined);
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a malformed authorization header', () => {
    const req = makeRequest('NotBearer abc');
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a token with an invalid signature', () => {
    const token = makeToken({}, {
      secret: 'different-test-secret',
    });
    const req = makeRequest(`Bearer ${token}`);
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an expired token', () => {
    const token = makeToken({}, { expiresIn: -1 });
    const req = makeRequest(`Bearer ${token}`);
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a token with the wrong issuer', () => {
    const token = makeToken({}, { issuer: 'wrong-issuer' });
    const req = makeRequest(`Bearer ${token}`);
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a token with the wrong audience', () => {
    const token = makeToken({}, { audience: 'wrong-client' });
    const req = makeRequest(`Bearer ${token}`);
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a token without a valid user ID', () => {
    const token = makeToken({}, { subject: '' });
    const req = makeRequest(`Bearer ${token}`);
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a token with an unsupported role', () => {
    const token = makeToken({ role: 'superuser' });
    const req = makeRequest(`Bearer ${token}`);
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 500 if the JWT secret is missing', () => {
    delete process.env.JWT_SECRET;

    const token = makeToken();
    const req = makeRequest(`Bearer ${token}`);
    const res = makeResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
