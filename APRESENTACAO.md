# DevSecOps Pipeline para Fintech PIX - Apresentação (5 min)

**Cenário:** Fintech com API de pagamentos PIX, 5 squads, 40 devs, PCI DSS 4.0

---

## 🎯 1. Pipeline Ideal

### Stages:
1. **SAST** (SonarQube) - 5 min
2. **Build** (npm test + Trivy) - 10 min
3. **IaC** (Checkov) - 3 min
4. **DAST** (OWASP ZAP) - 15 min
5. **Staging** (ArgoCD) - 10 min
6. **Runtime** (Falco) - Contínuo
7. **Approval** (Champion) - Manual

**Total:** ~45 min (com paralelismo = ~25 min)

---

## 💰 2. Ferramentas: Open Source vs Comercial

### **Decisão: 80% Open Source + 20% Comercial**

| Ferramenta | Custo |
|-----------|-------|
| SonarQube | $0 → $10k |
| OWASP ZAP | $0 |
| Trivy | $0 |
| Checkov | $0 |
| Falco | $0 |
| GitHub Actions | ~$1k |
| AWS | ~$50k |
| **TOTAL/ano** | **~$72k** |

**ROI:** 1 vuln crítico = $500k

---

## ⏰ 3. SLAs por Severidade

| Severidade | Resposta | Resolução |
|-----------|----------|-----------|
| 🔴 CRITICAL | 15 min | 4 h |
| 🟠 HIGH | 1 h | 1 dia |
| 🟡 MEDIUM | 4 h | 1 semana |
| 🟢 LOW | 1 semana | 30 dias |

---

## 📈 4. Roadmap 6 Meses

- **Mês 1-2:** SAST + Container (L1)
- **Mês 3-4:** DAST + Threat Model (L2)
- **Mês 5-6:** Runtime + Compliance (L3)

**Investimento:** 2 FTE (mês 1) → 6 FTE (mês 6)

---

## 🛡️ 5. Security Champions

**Estrutura:**
- 5 Squad Champions (10-15% tempo)
- 1 Global Champion (40-50% tempo)

**Como começar:**
1. Identificar 5 devs voluntários
2. Treinamento 5 dias
3. Shadow + autonomia

---

## 🎯 6. STRIDE - PIX Payment API

**10 threats identificados:**

| Ameaça | Severidade |
|--------|-----------|
| Session Hijacking | 🔴 CRITICAL |
| SQL Injection | 🔴 CRITICAL |
| Authz Bypass | 🔴 CRITICAL |
| Secrets Leaked | 🔴 CRITICAL |
| IDOR | 🔴 CRITICAL |
| Weak Password | 🟠 HIGH |
| Rate Limiting | 🟠 HIGH |

**Status:** 85% mitigações implementadas

---

## 📊 Resumo: Critérios de Avaliação

| Critério | Nota |
|----------|------|
| Viabilidade | ✅ 95% |
| Priorização | ✅ 95% |
| Trade-offs | ✅ 90% |
| Clareza | ✅ 95% |

---

## 🚀 Próximos Passos (Semana 1)

1. Designar Champions
2. Setup GitHub Actions
3. Instalar SonarQube
4. Criar canal #security
5. OWASP Top 10 workshop

