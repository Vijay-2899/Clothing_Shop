const request = require('supertest');
const app = require('./server');

describe('Product API', () => {
  it('GET /api/products returns 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
  });

  it('POST /api/products creates item', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test', price: 10, category: 'men' });
    expect(res.statusCode).toEqual(201);
  });
});