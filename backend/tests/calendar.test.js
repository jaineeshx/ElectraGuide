jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { uid: 'test-user' };
  next();
});

const request = require('supertest');
const app = require('../server');

describe('Calendar Routes', () => {
  it('POST /api/calendar/sync should return success message', async () => {
    const res = await request(app)
      .post('/api/calendar/sync')
      .send({ eventTitle: 'Vote', eventDate: '2026-05-07' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Successfully synced');
  });
});
