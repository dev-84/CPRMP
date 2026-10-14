const request = require('supertest');
const app = require('../../backend/src/app');

describe('CPRMP API', () => {
  test('GET /api/health returns a successful health response', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      message: 'CPRMP backend is running',
    });
  });

  test('an unknown route returns a 404 error response', async () => {
    const response = await request(app).get('/api/not-a-real-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Route not found: GET /api/not-a-real-route',
    });
  });
});
