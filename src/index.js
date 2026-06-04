'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const transferRouter = require('./transfer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rate limiting - proteção contra brute force
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Rotas
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'pix-api', version: '1.0.0' });
});

app.use('/api', transferRouter);

// Handler 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Handler de erro global
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Só inicia o servidor se não for importado como módulo (testes)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`PIX API running on port ${PORT}`);
  });
}

module.exports = app;
