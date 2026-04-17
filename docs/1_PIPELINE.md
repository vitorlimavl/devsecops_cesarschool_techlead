# 1. Pipeline Ideal - Estrutura e Stages

##  Visão Geral

```
Code Push → SAST → Build → DAST → Deploy Staging → Security Scan → Deploy Prod
```

---

##  Stages do Pipeline

### **Stage 1: SAST (Static Analysis) - 5 min**
**Quando:** Ao fazer push
**Ferramentas:**
- `SonarQube Community` - análise código
- `npm audit` - vulnerabilidades de dependências
- `Snyk CLI` (open source) - scanning rápido

**Ação:** Bloqueia merge se CRITICAL/HIGH

**Viabilidade:**  Executa em paralelo, não bloqueia devs muito

---

### **Stage 2: Build & Unit Tests - 10 min**
**Quando:** SAST passou
**Ferramentas:**
- `npm test` (Jest)
- Docker build + scanning com `Trivy` (open source)

**Saída:** Artefato pronto para DAST

---

### **Stage 3: DAST (Dynamic Analysis) - 15 min**
**Quando:** Deploy em ambiente staging
**Ferramentas:**
- `OWASP ZAP` (open source) - rodando em container
- Testes automatizados de segurança

**Ação:** Relatório apenas (não bloqueia ainda, feedback para devs)

---

### **Stage 4: IaC Scanning - 3 min**
**Quando:** Pull request com mudanças K8s/Terraform
**Ferramentas:**
- `TfLint` (Terraform)
- `Kube-score` (Kubernetes manifests)
- `Checkov` (open source, multi-IaC)

**Ação:** Bloqueia merge se misconfigurações PCI DSS

---

### **Stage 5: Deploy Staging - 10 min**
**Quando:** Todos os testes passam
**Ferramentas:**
- ArgoCD (GitOps)
- Helm charts com validação

---

### **Stage 6: Security Scanning em Runtime - 5 min**
**Quando:** Pod rodando
**Ferramentas:**
- `Falco` (open source) - detecção de anomalias
- AWS CloudTrail + logs centralizados (CloudWatch)

---

### **Stage 7: Approval & Deploy Produção - Manual**
**Quando:** Validação manual do Security Champion
**Requerimentos:**
- Code review de segurança 
- DAST passou 
- Sem dependências vulneráveis 
- Auditoria automática passou 

---

## ⏱ Timeline Total

| Stage | Tempo | Bloqueante |
|-------|-------|-----------|
| SAST | 5 min |  Sim |
| Build | 10 min |  Sim |
| DAST | 15 min |  Não (feedback) |
| IaC | 3 min |  Sim |
| Deploy Staging | 10 min | - |
| Runtime Security | 5 min |  Não (observação) |
| **Total** | **~45 min** | - |

---

##  Parallelização

```
SAST + IaC + Build (paralelo)
  ↓
DAST (paralelo com Deploy Staging)
  ↓
Manual Approval
  ↓
Deploy Prod
```

**Tempo crítico real:** ~25 min (com paralelismo)

---

##  Viabilidade para 40 devs

| Aspecto | Status | Justificativa |
|--------|--------|---|
| Custo |  Baixo | Maioria open source |
| Tempo setup |  3-4 weeks | CI/CD com GitHub Actions |
| Capacidade |  Sim | Roda em containers, escalável |
| Experiência |  Média | Requer 1-2 DevSecOps seniors |

