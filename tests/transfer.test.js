'use strict';

const request = require('supertest');
const app = require('../src/index');

describe('PIX API - Health', () => {
  it('GET /health should return 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('pix-api');
  });
});

describe('PIX API - Balance', () => {
  it('GET /api/balance/:userId should return balance for valid user', async () => {
    const res = await request(app).get('/api/balance/user_001');
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('user_001');
    expect(typeof res.body.balance).toBe('number');
  });

  it('GET /api/balance/:userId should return 404 for unknown user', async () => {
    const res = await request(app).get('/api/balance/user_999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Account not found');
  });
});

describe('PIX API - Transfer', () => {
  it('POST /api/transfer should complete a valid transfer', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .send({ senderId: 'user_001', recipientId: 'user_002', amount: 100 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Transfer completed successfully');
    expect(res.body.transactionId).toMatch(/^tx_/);
  });

  it('POST /api/transfer should return 400 when senderId is missing', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .send({ recipientId: 'user_002', amount: 100 });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('senderId');
  });

  it('POST /api/transfer should return 400 when amount is zero', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .send({ senderId: 'user_001', recipientId: 'user_002', amount: 0 });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('amount');
  });

  it('POST /api/transfer should return 400 when amount is negative', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .send({ senderId: 'user_001', recipientId: 'user_002', amount: -50 });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('amount');
  });

  it('POST /api/transfer should return 422 when sender has insufficient funds', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .send({ senderId: 'user_002', recipientId: 'user_001', amount: 999999 });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('Insufficient funds');
  });

  it('POST /api/transfer should return 400 when sender equals recipient', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .send({ senderId: 'user_001', recipientId: 'user_001', amount: 10 });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('same account');
  });

  it('POST /api/transfer should return 404 for unknown sender', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .send({ senderId: 'user_999', recipientId: 'user_002', amount: 10 });
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('Sender');
  });

  it('POST /api/transfer should return 404 for unknown recipient', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .send({ senderId: 'user_001', recipientId: 'user_999', amount: 10 });
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('Recipient');
  });
});

describe('PIX API - Transfer History', () => {
  it('GET /api/transfers/:userId should return transaction list', async () => {
    const res = await request(app).get('/api/transfers/user_001');
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('user_001');
    expect(Array.isArray(res.body.transactions)).toBe(true);
  });
});

describe('PIX API - 404', () => {
  it('Unknown route should return 404', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
  });
});
