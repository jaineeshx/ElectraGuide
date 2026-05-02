jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { uid: 'test-user-123', email: 'test@example.com', name: 'Test User' };
  next();
});

const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Journey Routes', () => {
  beforeEach(async () => {
    // In a real app we'd use mongodb-memory-server
    // Mocking the User model for simplicity in this test file
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User.prototype, 'save').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /api/journey/update should create or update user progress', async () => {
    const res = await request(app)
      .post('/api/journey/update')
      .send({ stepId: 'register', completed: true });

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
