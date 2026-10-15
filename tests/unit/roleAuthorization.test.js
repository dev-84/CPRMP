
const { authorizeRoles } = require('../../backend/src/middleware/roleAuthorization');

function makeResponse() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };

  res.status.mockReturnValue(res);
  return res;
}

describe('authorizeRoles', () => {
  test('allows a student when student role is permitted', () => {
    const req = { user: { id: 'student-1', role: 'student' } };
    const res = makeResponse();
    const next = jest.fn();

    authorizeRoles('student')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('allows an admin when admin role is permitted', () => {
    const req = { user: { id: 'admin-1', role: 'admin' } };
    const res = makeResponse();
    const next = jest.fn();

    authorizeRoles('admin')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('allows a recruiter when recruiter role is permitted', () => {
    const req = { user: { id: 'recruiter-1', role: 'recruiter' } };
    const res = makeResponse();
    const next = jest.fn();

    authorizeRoles('recruiter')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('rejects a request without an authenticated user', () => {
    const req = {};
    const res = makeResponse();
    const next = jest.fn();

    authorizeRoles('student')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an authenticated user with the wrong role', () => {
    const req = { user: { id: 'student-1', role: 'student' } };
    const res = makeResponse();
    const next = jest.fn();

    authorizeRoles('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an empty list of allowed roles', () => {
    expect(() => authorizeRoles()).toThrow(
      'authorizeRoles requires valid role names'
    );
  });

  test('rejects an unsupported role configuration', () => {
    expect(() => authorizeRoles('superuser')).toThrow(
      'authorizeRoles requires valid role names'
    );
  });
});
