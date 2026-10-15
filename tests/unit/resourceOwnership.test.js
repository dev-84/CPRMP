
const {
  checkResourceOwnership,
} = require('../../backend/src/middleware/resourceOwnership');

function makeResponse() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };

  res.status.mockReturnValue(res);
  return res;
}

describe('checkResourceOwnership', () => {
  test('allows the owner of a resource', () => {
    const req = {
      user: { id: 'user-1', role: 'student' },
      resource: { userId: 'user-1' },
    };
    const res = makeResponse();
    const next = jest.fn();

    checkResourceOwnership()(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('supports the createdBy ownership field', () => {
    const req = {
      user: { id: 'recruiter-1', role: 'recruiter' },
      resource: { createdBy: 'recruiter-1' },
    };
    const res = makeResponse();
    const next = jest.fn();

    checkResourceOwnership({ ownerField: 'createdBy' })(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('rejects a user who does not own the resource', () => {
    const req = {
      user: { id: 'user-2', role: 'student' },
      resource: { userId: 'user-1' },
    };
    const res = makeResponse();
    const next = jest.fn();

    checkResourceOwnership()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a request without an authenticated user', () => {
    const req = { resource: { userId: 'user-1' } };
    const res = makeResponse();
    const next = jest.fn();

    checkResourceOwnership()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects when the resource is missing', () => {
    const req = { user: { id: 'user-1', role: 'student' } };
    const res = makeResponse();
    const next = jest.fn();

    checkResourceOwnership()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects when the ownership field is missing', () => {
    const req = {
      user: { id: 'user-1', role: 'student' },
      resource: {},
    };
    const res = makeResponse();
    const next = jest.fn();

    checkResourceOwnership()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('allows an admin override only when explicitly enabled', () => {
    const req = {
      user: { id: 'admin-1', role: 'admin' },
      resource: { userId: 'user-1' },
    };
    const res = makeResponse();
    const next = jest.fn();

    checkResourceOwnership({ allowAdmin: true })(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('does not allow admin override by default', () => {
    const req = {
      user: { id: 'admin-1', role: 'admin' },
      resource: { userId: 'user-1' },
    };
    const res = makeResponse();
    const next = jest.fn();

    checkResourceOwnership()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
