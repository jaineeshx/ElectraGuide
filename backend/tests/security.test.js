const request = require('supertest');
const app = require('../server');

describe('Security Middleware', () => {
  it('should have security headers (Helmet)', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  it('should return 401 for unauthorized access to protected routes', async () => {
    const res = await request(app).get('/api/journey/progress');
    expect(res.statusCode).toEqual(401);
  });

  it('should have CORS enabled for allowed origins', async () => {
    const res = await request(app)
      .options('/health')
      .set('Origin', 'http://localhost:8080')
      .set('Access-Control-Request-Method', 'GET');
    
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:8080');
  });
});
