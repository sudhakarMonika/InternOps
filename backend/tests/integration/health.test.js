const app = require('../../src/app');
const { generateAccessToken } = require('../../src/utils/tokens');

const adminToken = generateAccessToken({
  id: 'test-admin-id',
  role: 'ADMIN',
});
const userToken = generateAccessToken({
  id: 'test-user-id',
  role: 'USER',
});

describe('Health Check Integration Tests', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return 401 without authentication', async () => {
  const res = await app.inject({
    method: 'GET',
    url: '/health',
  });

  expect(res.statusCode).toBe(401);
});

it('should return 403 for non-admin users', async () => {
  const res = await app.inject({
    method: 'GET',
    url: '/health',
    headers: {
      authorization: `Bearer ${userToken}`,
    },
  });

  expect(res.statusCode).toBe(403);
});
    it('should always return 200 in test mode (Redis is disabled)', async () => {
      // In test environment Redis is forced to 'disabled' so the health
      // endpoint can only ever return 200. Asserting 200 directly
      // eliminates the previous non-determinism (#374).
      const res = await app.inject({
  method: 'GET',
  url: '/health',
  headers: {
    authorization: `Bearer ${adminToken}`,
  },
});
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /health/db', () => {
  it('should return 401 without authentication', async () => {
  const res = await app.inject({
    method: 'GET',
    url: '/health/db',
  });

  expect(res.statusCode).toBe(401);
});

it('should return 403 for non-admin users', async () => {
  const res = await app.inject({
    method: 'GET',
    url: '/health/db',
    headers: {
      authorization: `Bearer ${userToken}`,
    },
  });

  expect(res.statusCode).toBe(403);
});
    it('should return database connection status', async () => {
      const res = await app.inject({
  method: 'GET',
  url: '/health/db',
  headers: {
    authorization: `Bearer ${adminToken}`,
  },
});
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body).toEqual({
        status: 'ok',
        db: 'connected',
      });
    });
  });

  describe('GET /health/full', () => {
  it('should return 401 without authentication', async () => {
  const res = await app.inject({
    method: 'GET',
    url: '/health/full',
  });

  expect(res.statusCode).toBe(401);
});

it('should return 403 for non-admin users', async () => {
  const res = await app.inject({
    method: 'GET',
    url: '/health/full',
    headers: {
      authorization: `Bearer ${userToken}`,
    },
  });

  expect(res.statusCode).toBe(403);
});
    it('should return full system health status (always 200 in test)', async () => {
      const res = await app.inject({
  method: 'GET',
  url: '/health/full',
  headers: {
    authorization: `Bearer ${adminToken}`,
  },
});
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.status).toBe('healthy');
      expect(body.checks).toEqual({ db: true, redis: true });
    });
  });
});
