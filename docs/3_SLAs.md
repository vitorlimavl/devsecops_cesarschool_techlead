# 3. SLAs por Severidade - Matriz de Resposta

**Contexto:** Fintech com PIX (pagamentos reais) + Compliance PCI DSS 4.0

---

## 📊 Tabela SLA

| Severidade | Definição | Resposta | Resolução | Escalação |
|-----------|-----------|----------|-----------|-----------|
| **CRITICAL** | RCE, SQL Injection, Data breach, Cartão exposto | 15 min | 4 h | CEO + CISO |
| **HIGH** | Auth bypass, Weak crypto, Secrets in code | 1 h | 1 dia | CTO + Security Lead |
| **MEDIUM** | XSS, CSRF, Weak logging, Info disclosure | 4 h | 1 semana | Squad Lead |
| **LOW** | Typos, Weak naming, Config issues | 1 semana | 30 dias | Dev (backlog) |

---

## 🚨 CRITICAL (Tempo Real)

**Exemplos:**
- Remote Code Execution
- SQL Injection em endpoint de dados de cartão
- Credenciais de produção em repositório
- Vulnerabilidade conhecida com POC público (CVE 9.0+)

**Ação:**
1. ⏸️ **Pausar** deployment
2. 🔴 **Rollback** imediato se em produção
3. 📞 **Page** CTO/CISO
4. 🔍 **Investigar** impacto em dados de clientes
5. 📝 **Notificar** compliance/legal
6. 🚀 **Deploy** hotfix após validação

**SLA de resposta:** 15 minutos
**SLA de resolução:** 4 horas

---

## 🔴 HIGH (Dentro de 1 dia)

**Exemplos:**
- Authentication bypass (mas com múltiplos passos)
- Weak encryption algorithm (RC4, MD5)
- Secrets em logs
- Path traversal
- CVE 7.0-8.9

**SLA de resposta:** 1 hora
**SLA de resolução:** 1 dia

---

## 🟠 MEDIUM (Dentro de 1 semana)

**Exemplos:**
- XSS vulnerabilities
- CSRF tokens faltando
- Weak password policy
- Insufficient logging
- CVE 5.0-6.9

**SLA de resposta:** 4 horas
**SLA de resolução:** 1 semana

---

## 🟡 LOW (Backlog)

**Exemplos:**
- Code quality issues
- Missing comments
- Weak variable naming
- CVE < 5.0

**SLA de resposta:** 1 semana
**SLA de resolução:** 30 dias

---

## 📈 Distribuição Esperada

Baseado em dados de pipelines similares:

- CRITICAL: 2-3 por mês (0.1%)
- HIGH: 20-30 por mês (5%)
- MEDIUM: 150-200 por mês (30%)
- LOW: 400-500 por mês (65%)

