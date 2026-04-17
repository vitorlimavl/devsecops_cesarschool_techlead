# 4. Roadmap 6 Meses: De L1 a L3

**Estratégia:** Incrementalismo. Quick wins primeiro. Tecnologia depois.

---

## 📅 Timeline Overview

```
Mês 1   │ Mês 2  │ Mês 3  │ Mês 4  │ Mês 5  │ Mês 6
L1      │ L1.5   │ L2     │ L2.5   │ L3     │ L3+
```

---

## 🔴 MÊS 1: L1 - REATIVO (Detecção)

**Objetivo:** Visibilidade rápida. Sem bloqueios ao pipeline.

### Semana 1: Setup Inicial
- [ ] GitHub Actions workflow setup
- [ ] SonarQube Community instalado
- [ ] npm audit integrado em CI
- [ ] Branch protection rules ativadas
- [ ] Slack integrations

### Semana 2: SAST Enforcement
- [ ] Criar políticas básicas de SAST
- [ ] Parar merges de HIGH+ findings
- [ ] Criar template de issue privada
- [ ] Treinar squad sobre SonarQube

### Semana 3: Trivy + Container Scanning
- [ ] Trivy integrado no Docker build
- [ ] Scan de imagens antes de push
- [ ] Registry: ECR com restrições

### Semana 4: Security Champion Nomeação
- [ ] Designar 1 security champion por squad
- [ ] 1 security champion global (CTO-level)
- [ ] Primeiros treinamentos
- [ ] Criar canal #security-incidents

---

## 🟠 MÊS 2: L1.5 - REATIVO + DAST

**Objetivo:** Começar dinâmico + começar a detectar lógica.

### Semana 5: DAST com OWASP ZAP
- [ ] OWASP ZAP container rodando
- [ ] Integração no pipeline (não bloqueante)
- [ ] Testes de autenticação + autorização
- [ ] Reporting automático

### Semana 6-7: IaC Scanning
- [ ] Checkov integrado
- [ ] Scanning de K8s manifests
- [ ] Políticas PCI DSS ativadas

### Semana 8: First Security Review
- [ ] Todos squads passaram SAST
- [ ] 80% dos findings MEDIUM/LOW resolvidos
- [ ] 0 CRITICAL em staging

---

## 🟡 MÊS 3: L2 - PROATIVO

**Objetivo:** Começar a pensar em Design. Threat modeling.

### Semana 9: Secrets Scanning
- [ ] git-secrets em git hooks
- [ ] Rotate todos os secrets conhecidos
- [ ] AWS Secrets Manager setup

### Semana 10-11: SBOM + Dependency Management
- [ ] Syft gerando SBOM em build
- [ ] Dependabot ou Renovate ativado
- [ ] Policy: aprovar updates em < 48h

### Semana 12: First Threat Model
- [ ] Escolher 1 componente crítico (PIX integration)
- [ ] Fazer STRIDE básico
- [ ] Documentar risks + mitigations

---

## 🟢 MÊS 4: L2.5 - PROATIVO + DESIGN

**Objetivo:** Integrar segurança em design.

### Semana 13-14: API Security Standards
- [ ] Definir API security checklist
- [ ] OAuth 2.0 + PKCE para mobile
- [ ] Rate limiting (AWS API Gateway)
- [ ] Input validation framework

### Semana 15: Falco Runtime Security
- [ ] Falco instalado em todos os nodes
- [ ] Rules customizadas para PIX API
- [ ] Alertas integrados

### Semana 16: Security Review Process
- [ ] Code review guidelines atualizado
- [ ] Security checklist em PR template
- [ ] Champion review obrigatório

---

## 🟢 MÊS 5: L3 - PREVENTIVO

**Objetivo:** Cultura de segurança. Automação matura.

### Semana 17-18: Compliance Automation
- [ ] PCI DSS checks automáticos
- [ ] Monthly scan report gerado
- [ ] Gap analysis automática

### Semana 19: Incident Response Playbooks
- [ ] Documento: o que fazer se encontrar credencial
- [ ] Simulado: incident response drill
- [ ] Post-mortems automáticas

### Semana 20: Security Training Program
- [ ] Secure coding workshop (OWASP)
- [ ] Champions certification
- [ ] Monthly security newsletter

---

## 🔵 MÊS 6: L3+ - CONTÍNUO

**Objetivo:** Excelência. Antecipação. Inovação.

### Semana 21-22: Advanced Threat Modeling
- [ ] Threat models para todos os componentes

### Semana 23-24: Supply Chain Security
- [ ] SBOM em todas as imagens
- [ ] Third-party risk assessment
- [ ] Vendor security reviews

---

## 💰 Investimento por Fase

| Mês | Pessoas | Ferramentas | Total |
|-----|---------|-----------|-------|
| 1-2 | 2 FTE | $2k | $180k |
| 3-4 | 4 FTE | $5k | $280k |
| 5-6 | 6 FTE | $10k | $380k |
| **TOTAL** | **6 FTE** | **~$17k** | **$840k/ano** |

**ROI:** Uma vulnerabilidade crítica em produção custa ~$500k-1M (fintech)

