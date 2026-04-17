# 6. STRIDE Analysis - Exercício Prático

**Escopo:** PIX Payment API - Componente crítico da fintech

**Método:** STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)

---

## 🎯 Contexto

```
Cliente (Mobile App) → API Gateway (AWS) → Node.js Service
                              ↓
                        Database (PII + Cartões)
                              ↓
                    PIX Settlement (Banco Central)
```

**Objetivo:** $500 mil transferência de um cliente para outro

**Dados críticos:**
- Credenciais bancárias
- Dados de cartão
- Senhas + PINs
- CPF/CNPJ

---

## 🔍 STRIDE Analysis

### **S - SPOOFING (Impersonação)**

**Ameaça:** Attacker se passa por cliente legítimo

#### Risk 1.1: Session Hijacking
- Cenário: Attacker rouba JWT token
- Impacto: Transferências em nome da vítima
- CVSS: 8.5 (High)
- Mitigação: JWT com RS256, expira 15 min, 2FA, Device binding

#### Risk 1.2: Weak Password
- Cenário: Attacker brute force a senha
- Impacto: Acesso à conta
- CVSS: 7.0 (High)
- Mitigação: Bcrypt cost 12, rate limiting, 2FA, account lockout

#### Risk 1.3: MFA Bypass
- Cenário: Attacker intercepta SMS ou TOTP
- Impacto: 2FA não protege
- CVSS: 8.0 (High)
- Mitigação: TOTP preferred, WebAuthn, backup codes offline

---

### **T - TAMPERING (Modificação de Dados)**

**Ameaça:** Attacker altera dados em trânsito ou no banco

#### Risk 2.1: SQL Injection
- Cenário: Attacker injeta SQL
- Impacto: Ler/modificar dados
- CVSS: 9.0 (Critical)
- Mitigação: Prepared statements, ORM, SAST, input validation

#### Risk 2.2: Authorization Bypass
- Cenário: Attacker modifica "to_account_id"
- Impacto: Transferir para conta errada
- CVSS: 9.0 (Critical)
- Mitigação: "from" derivado JWT, "to" validado, audit log

#### Risk 2.3: API Response Tampering
- Cenário: MITM modifica valor de transação
- Impacto: Erro financeiro
- CVSS: 8.0 (High)
- Mitigação: TLS 1.2+, cert pinning, API signature (HMAC)

---

### **R - REPUDIATION (Negação)**

**Ameaça:** Usuário nega ter feito ação / attacker faz sem rastreabilidade

#### Risk 3.1: No Audit Trail
- Cenário: Usuário nega transferência
- Impacto: Sem prova de quem fez
- CVSS: 7.0 (Medium, violação PCI)
- Mitigação: Audit log completo, imutável, 7 anos retention

#### Risk 3.2: Malicious Insider
- Cenário: DBA apaga logs
- Impacto: Cobertura de roubo
- CVSS: 9.5 (Critical)
- Mitigação: Logs imutáveis (S3), signer separado, MFA

---

### **I - INFORMATION DISCLOSURE (Vazamento)**

**Ameaça:** Dados sensíveis expostos

#### Risk 4.1: PII em Logs
- Cenário: CPF/Cartão logado
- Impacto: Data breach
- CVSS: 8.5 (High)
- Mitigação: Data masking, SAST rule, structured logging

#### Risk 4.2: Error Messages Leaking Info
- Cenário: Erro revela DB schema
- Impacto: Facilita SQL injection
- CVSS: 6.5 (Medium)
- Mitigação: Generic error messages, detailed only in logs

#### Risk 4.3: Secrets in Repository
- Cenário: AWS key em git
- Impacto: Acesso direto
- CVSS: 9.5 (Critical)
- Mitigação: git-secrets, GitHub scanning, Secrets Manager

---

### **D - DENIAL OF SERVICE (Parar o Sistema)**

**Ameaça:** Attacker torna serviço indisponível

#### Risk 5.1: Rate Limiting Weakness
- Cenário: 10k requests/segundo
- Impacto: API lenta
- CVSS: 7.5 (High)
- Mitigação: Rate limit 2000 req/s, per-user 100 req/min

#### Risk 5.2: DDoS
- Cenário: Bot network 1M req/s
- Impacto: Service down
- CVSS: 7.5 (High)
- Mitigação: AWS Shield, CloudFlare, geo blocking

---

### **E - ELEVATION OF PRIVILEGE (Escalar Permissões)**

**Ameaça:** Attacker ganha acesso admin

#### Risk 6.1: IDOR (Insecure Direct Object Reference)
- Cenário: GET /account/123 → GET /account/456
- Impacto: Ver saldo de outro cliente
- CVSS: 8.0 (High)
- Mitigação: Authorization check sempre, SAST rule

#### Risk 6.2: Privilege Escalation
- Cenário: User modifica JWT role
- Impacto: Acesso admin
- CVSS: 9.0 (Critical)
- Mitigação: JWT signed, role lido do banco, backend check

#### Risk 6.4: Vertical Escalation
- Cenário: User pretende ser admin
- Impacto: Ver dados de todos
- CVSS: 9.5 (Critical)
- Mitigação: Role armazenado banco, verificado sempre

---

## 📊 Risk Matrix

| ID | Ameaça | Impacto | CVSS | Severidade |
|----|--------|--------|------|-----------|
| 1.1 | Session Hijacking | Alta | 8.5 | 🔴 CRITICAL |
| 2.1 | SQL Injection | Crítica | 9.0 | 🔴 CRITICAL |
| 2.2 | Authz Bypass | Crítica | 9.0 | 🔴 CRITICAL |
| 4.3 | Secrets Leaked | Crítica | 9.5 | 🔴 CRITICAL |
| 6.4 | Priv Escalation | Crítica | 9.5 | 🔴 CRITICAL |
| 1.2 | Weak Password | Alta | 7.0 | 🟠 HIGH |
| 3.1 | No Audit Trail | Alta | 7.0 | 🟠 HIGH |
| 5.1 | Rate Limiting | Alta | 7.5 | 🟠 HIGH |

---

## ✅ Mitigations Status

**Green (implementado):**
- ✅ HTTPS + TLS 1.2
- ✅ JWT signed RS256
- ✅ Bcrypt password
- ✅ 2FA (TOTP)
- ✅ SQL prepared statements
- ✅ Rate limiting
- ✅ Input validation

**Yellow (partial):**
- ⚠️ Audit logging (não immutable)
- ⚠️ Secrets management (alguns em .env)
- ⚠️ Error handling (alguns verbose)

**Red (não implementado):**
- ❌ API response signing (HMAC)
- ❌ Device binding
- ❌ Log immutability
- ❌ Certificate pinning

---

## 🎯 Implementação Roadmap

### **Semana 1-2:**
- ✅ HTTPS + TLS
- ✅ Fix error messages
- ✅ Move secrets to AWS Secrets Manager

### **Semana 3-4:**
- ✅ HMAC signing em API
- ✅ Audit logs immutable
- ✅ Certificate pinning

### **Semana 5-6:**
- ✅ Device binding
- ✅ WebAuthn
- ✅ Cross-sign logs

---

## 📝 Deliverable

**Documento de Threat Model:**

```
PIX Payment API - STRIDE Analysis
Data: 2026-04-16

## Executive Summary
- 10 risks identificados
- 5 CRITICAL
- 3 HIGH
- Mitigações implementadas: 85%
- Roadmap: Completar em 6 semanas

## Próximos Passos
1. Code review com Global Security Champion
2. Implementar mitigações
3. Teste de penetração
4. Audit externo
```

