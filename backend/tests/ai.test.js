jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { uid: 'test-user', email: 'test@example.com' };
  next();
});

const request = require('supertest');
const app = require('../server');
const { getChatResponse } = require('../services/aiService');

jest.mock('../services/aiService');

describe('AI Routes', () => {
  it('POST /api/ai/chat should return AI response', async () => {
    getChatResponse.mockResolvedValue('Hello from Gemini');

    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Hello', history: [] });

    expect(res.statusCode).toEqual(200);
    expect(res.body.response).toEqual('Hello from Gemini');
  });

  it('POST /api/ai/simulate should return scenario response', async () => {
    const { simulateScenario } = require('../services/aiService');
    simulateScenario.mockResolvedValue('Scenario response');

    const res = await request(app)
      .post('/api/ai/simulate')
      .send({ scenario: 'first time voter' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.response).toEqual('Scenario response');
  });
});
