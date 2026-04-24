# Prática 2: Threat Modeling com STRIDE - API de Transferência PIX

## Objetivo
Aplicar metodologia STRIDE em um componente crítico da API PIX para identificar ameaças e definir mitigações.

## Contexto
Baseado em docs/6_STRIDE.md e no Slide 2 da apresentação sobre ameaças reais.

---

## 1. Escopo: API Endpoint POST /transfer

**Descrição:**
```
Endpoint responsável por iniciar transferência de valores entre contas de clientes.
Stack: Node.js + Express, banco PostgreSQL, AWS RDS

POST /api/v1/transfer
{
  "recipient_account": "string (CPF ou CNPJ)",
  "amount": "number (em centavos)",
  "reference": "string",
  "scheduled_date": "ISO 8601"
}
```

**Dados sensíveis em trânsito:**
- CPF/CNPJ do destinatário
- Valor da transação
- Token JWT (header)

---

## 2. Análise STRIDE

### S - SPOOFING (Impersonação)

**Ameaça 2.1: Token JWT Expirado Aceito**
- Risco: Atacante reutiliza token JWT antigo
- Impacto: Transferência em nome de outra pessoa
- CVSS: 8.5
- Status: ENCONTRADO
- Mitigação implementada:
  ```javascript
  // Validar expiração obrigatória
  jwt.verify(token, secret, { algorithms: ['RS256'], expiresIn: '15m' })
  ```
- Evidência de correção: Commit d3a8c7 - "fix: enforce JWT expiration on transfer endpoint"

**Ameaça 2.2: Senha Fraca + Sem 2FA**
- Risco: Força bruta na senha
- Impacto: Acesso à conta
- CVSS: 7.0
- Status: IDENTIFICADO
- Mitigação: Bcrypt cost 12 + 2FA obrigatória para transfer
- Próximo: Implementar nas próximas sprints (L2)

---

### T - TAMPERING (Modificação)

**Ameaça 3.1: Modificação do Valor de Transferência**
- Risco: MITM altera amount no payload
- Impacto: Transferência de valor incorreto
- CVSS: 9.0
- Status: PROTEGIDO (TLS 1.2+)
- Mitigação: TLS 1.2 obrigatório + HSTS header
- Configuração verificada:
  ```javascript
  app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  })
  ```

**Ameaça 3.2: Modificação de recipient_account**
- Risco: Atacante muda CPF destino
- Impacto: Dinheiro vai para conta errada
- CVSS: 9.5 (CRÍTICO)
- Status: PARCIALMENTE MITIGADO
- Problema: campo recipient_account vem do input
- Mitigação: Validar contra whitelist de contas do usuário
- Código corrigido:
  ```javascript
  // Validar que recipient está na whitelist do usuário
  const isAuthorized = await db.query(
    'SELECT id FROM trusted_recipients WHERE user_id = ? AND cpf = ?',
    [req.user.id, req.body.recipient_account]
  )
  if (!isAuthorized.rows.length) throw new Error('Unauthorized recipient')
  ```

---

### R - REPUDIATION (Negação)

**Ameaça 4.1: Sem Audit Trail**
- Risco: Usuário nega ter feito transferência
- Impacto: Sem prova de quem fez
- CVSS: 7.0
- Status: EM IMPLEMENTAÇÃO
- Solução: Log imutável de todas as transferências
- Schema do audit log:
  ```sql
  CREATE TABLE audit_transfers (
    id UUID PRIMARY KEY,
    user_id INT NOT NULL,
    recipient_cpf VARCHAR(11),
    amount BIGINT,
    status VARCHAR(20),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    signature BYTEA -- assinatura com chave privada
  );
  ```

---

### I - INFORMATION DISCLOSURE (Vazamento)

**Ameaça 5.1: CPF/CNPJ em Logs de Erro**
- Risco: Logs expostos contêm PII
- Impacto: Data breach
- CVSS: 8.5
- Status: ENCONTRADO E CORRIGIDO
- Exemplo antes:
  ```javascript
  logger.error(`Transfer failed for ${cpf}: ${error}`) // RUIM!
  ```
- Depois:
  ```javascript
  logger.error(`Transfer failed for recipient: ****${cpf.slice(-2)}`) // BOM
  ```

**Ameaça 5.2: Erro Revela Detalhes do Schema**
- Risco: Mensagem: "Account not found in accounts table"
- Impacto: Facilita SQL injection
- CVSS: 6.5
- Status: CORRIGIDO
- Solução:
  ```javascript
  try {
    // ...
  } catch (error) {
    logger.error(`Database error: ${error.message}`, { error })
    res.status(500).json({ error: 'Transfer processing error' }) // Generic
  }
  ```

---

### D - DENIAL OF SERVICE (Parar o Sistema)

**Ameaça 6.1: Rate Limiting Fraco**
- Risco: Atacante envia 10k requests/seg
- Impacto: API fica lenta
- CVSS: 7.5
- Status: MITIGADO
- Implementação:
  ```javascript
  const rateLimit = require('express-rate-limit')
  
  const transferLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 10, // máx 10 requisições
    message: 'Too many transfer attempts'
  })
  
  app.post('/api/v1/transfer', transferLimiter, transferHandler)
  ```

---

### E - ELEVATION OF PRIVILEGE (Escalar Permissões)

**Ameaça 7.1: IDOR (Insecure Direct Object Reference)**
- Risco: GET /api/v1/users/999/balance (vê outro usuário)
- Impacto: Ler saldo de qualquer cliente
- CVSS: 8.0
- Status: PROTEGIDO
- Solução:
  ```javascript
  router.get('/users/:userId/balance', (req, res) => {
    // Verificar: usuário logado === userId do path
    if (req.user.id !== parseInt(req.params.userId)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    // Continua...
  })
  ```

**Ameaça 7.2: Privilégio de Usuário para Admin**
- Risco: Usuário modifica JWT role
- Impacto: Acesso a operações admin
- CVSS: 9.0
- Status: SAFE (role no banco, não no JWT)
- Implementação:
  ```javascript
  async function verifyRole(userId, requiredRole) {
    const user = await db.query('SELECT role FROM users WHERE id = ?', [userId])
    return user.rows[0].role === requiredRole
  }
  ```

---

## 3. Resumo de Ameaças

| Ameaça | Severidade | Status | Ação |
|--------|-----------|--------|------|
| Token expirado | HIGH | Corrigido | Commit d3a8c7 |
| Tampering do valor | CRITICAL | Mitigado | TLS 1.2 ativo |
| Tampering do destinatário | CRITICAL | Corrigido | Whitelist implementada |
| Sem audit trail | HIGH | Em progresso | Schema criado |
| PII em logs | CRITICAL | Corrigido | Data masking ativo |
| Rate limiting | HIGH | Mitigado | express-rate-limit |
| IDOR | HIGH | Protegido | Verificação ownership |
| Privilégio | CRITICAL | Safe | Role em banco |

---

## 4. Roadmap de Implementação

**Já feito (L1):**
- Token validation
- TLS 1.2
- PII masking
- Rate limiting
- IDOR check

**Em progresso (L2):**
- Audit log imutável
- 2FA para transfer

**Futuro (L3):**
- Assinatura digital de transações
- Device binding
- Machine learning para fraud detection

---

## 5. Evidência de Commits

```
d3a8c7 - fix: enforce JWT expiration on transfer endpoint
e4f2b1 - fix: validate recipient against whitelist
a9c1d5 - fix: mask PII in error logs
c2b7f3 - feat: implement rate limiting on transfer
b5e8a2 - fix: add ownership check for IDOR prevention
```

Todos commitados no branch `feature/security-hardening-transfer`.

---

## Alinhamento com Disciplina

- Slide 2: "As Ameaças Reais (STRIDE Aplicado)"
- docs/6_STRIDE.md: Análise completa STRIDE
- docs/3_SLAs.md: CRITICAL ameaças = 24h para fix
- docs/5_SECURITY_CHAMPION.md: Champion faz code review com STRIDE em mente

