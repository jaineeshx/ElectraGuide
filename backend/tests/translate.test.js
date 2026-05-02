jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { uid: 'test-user' };
  next();
});

const request = require('supertest');
const app = require('../server');
const { translateText } = require('../services/translateService');

jest.mock('../services/translateService');

describe('Translation Routes', () => {
  it('POST /api/translate should return translated text', async () => {
    translateText.mockResolvedValue('Namaste');

    const res = await request(app)
      .post('/api/translate')
      .send({ text: 'Hello', targetLanguage: 'hi' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.translated).toEqual('Namaste');
  });
});
