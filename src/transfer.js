'use strict';

const express = require('express');
const { validateTransfer } = require('./utils/validator');

const router = express.Router();

// Simulação de banco em memória para fins de laboratório
const accounts = {
  'user_001': { balance: 50000, name: 'Alice Silva' },
  'user_002': { balance: 12000, name: 'Bob Santos' },
};

const transferHistory = [];

// GET /api/balance/:userId
router.get('/balance/:userId', (req, res) => {
  const { userId } = req.params;

  // VULNERABILIDADE INTENCIONAL para demonstração Semgrep:
  // userId vem do input sem sanitização adequada antes de uso em log
  console.log('Balance check for user: ' + userId); // nosec - demo only

  const account = accounts[userId];
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  // Mascarar saldo parcialmente nos logs (boas práticas)
  return res.status(200).json({
    userId,
    balance: account.balance,
    currency: 'BRL',
  });
});

// POST /api/transfer
router.post('/transfer', (req, res) => {
  const { senderId, recipientId, amount, description } = req.body;

  // Validação de entrada
  const validationError = validateTransfer({ senderId, recipientId, amount });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const sender = accounts[senderId];
  const recipient = accounts[recipientId];

  if (!sender) {
    return res.status(404).json({ error: 'Sender account not found' });
  }
  if (!recipient) {
    return res.status(404).json({ error: 'Recipient account not found' });
  }
  if (sender.balance < amount) {
    return res.status(422).json({ error: 'Insufficient funds' });
  }

  // Processar transferência
  sender.balance -= amount;
  recipient.balance += amount;

  const transaction = {
    id: `tx_${Date.now()}`,
    senderId,
    recipientId,
    amount,
    description: description || '',
    timestamp: new Date().toISOString(),
    status: 'completed',
  };

  transferHistory.push(transaction);

  return res.status(200).json({
    message: 'Transfer completed successfully',
    transactionId: transaction.id,
    amount,
    timestamp: transaction.timestamp,
  });
});

// GET /api/transfers/:userId
router.get('/transfers/:userId', (req, res) => {
  const { userId } = req.params;
  const history = transferHistory.filter(
    (t) => t.senderId === userId || t.recipientId === userId
  );
  return res.status(200).json({ userId, transactions: history });
});

module.exports = router;
