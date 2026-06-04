'use strict';

function validateTransfer({ senderId, recipientId, amount }) {
  if (!senderId || typeof senderId !== 'string') {
    return 'senderId is required and must be a string';
  }
  if (!recipientId || typeof recipientId !== 'string') {
    return 'recipientId is required and must be a string';
  }
  if (senderId === recipientId) {
    return 'Sender and recipient cannot be the same account';
  }
  if (amount === undefined || amount === null) {
    return 'amount is required';
  }
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return 'amount must be a finite number';
  }
  if (amount <= 0) {
    return 'amount must be greater than zero';
  }
  if (amount > 1000000) {
    return 'amount exceeds maximum transfer limit';
  }
  return null;
}

module.exports = { validateTransfer };
