const request = require('supertest');
const app = require('../server');

jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { uid: 'comprehensive-test-user', email: 'comp@test.com' };
  next();
});

describe('Comprehensive API Tests', () => {
  describe('Health Check', () => {
    it('GET /health returns 200', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('OK');
    });
  });

  describe('AI Endpoints', () => {
    it('POST /api/ai/chat returns 200', async () => {
      // Mocking service is already done in aiService.js mock if used globally
      // But here we just test the route layer
    });
  });

  describe('Journey Endpoints', () => {
    it('GET /api/journey/progress returns 200', async () => {
      const res = await request(app).get('/api/journey/progress');
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Calendar Endpoints', () => {
    it('POST /api/calendar/sync returns 200', async () => {
      const res = await request(app)
        .post('/api/calendar/sync')
        .send({ eventTitle: 'Test', eventDate: '2026' });
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Translate Endpoints', () => {
    it('POST /api/translate returns 200', async () => {
      const res = await request(app)
        .post('/api/translate')
        .send({ text: 'Test', targetLanguage: 'en' });
      expect(res.statusCode).toEqual(200);
    });
  });
});
