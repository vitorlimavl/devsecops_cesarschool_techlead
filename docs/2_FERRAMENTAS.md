# 2. Análise de Ferramentas: Open Source vs Comercial

##  Decisão: 80% Open Source + 20% Comercial

**Justificativa geral:**
- Fintech com budget moderado (~40 devs = US$ 2-3M/ano)
- Compliance PCI DSS: open source auditável é vantagem
- AWS já é pago (K8s, logs): aproveitar ecosystem

---

##  Ferramentas por Categoria

### **1. SAST (Static Analysis)**

####  REJEITADO: Checkmarx / Fortify (Comercial)
- Custo: US$ 100k+/ano
- Motivo: Overkill para 5 squads, high latency

####  ESCOLHIDO: SonarQube Community (Open Source)
- Custo: Gratuito (Community Edition)
- Vantagens:
  - Roda localmente / on-premises
  - Node.js + Terraform support
  - Integração GitHub Actions trivial
  - Auditável (compliance requirement)

---

### **2. DAST (Dynamic Analysis)**

####  ESCOLHIDO: OWASP ZAP (Open Source)
- Custo: Gratuito
- Vantagens:
  - Industry standard (OWASP)
  - Roda em Docker
  - Integração com GitHub Actions
  - Comunidade forte

---

### **3. Container Scanning**

####  ESCOLHIDO: Trivy (Open Source)
- Custo: Gratuito
- Vantagens:
  - Escaneia imagens Docker
  - Detecta CVEs automaticamente
  - Rápido (3s por imagem)
  - Integrado em CI/CD

---

### **4. IaC Scanning**

####  ESCOLHIDO: Checkov (Open Source)
- Custo: Gratuito
- Vantagens:
  - Suporta K8s + Terraform
  - Regras PCI DSS built-in
  - Executável e extensível

---

### **5. Log & Monitoring**

####  ESCOLHIDO: AWS CloudTrail + CloudWatch (Comercial, já pago)
- Fintech: auditoria é mandatória
- Não adiciona custo extra (já em conta AWS)

---

### **6. Runtime Security**

####  ESCOLHIDO: Falco (Open Source)
- Custo: Gratuito
- eBPF-based (kernel-level)
- Detecta comportamentos anormais
- Integração K8s nativa

---

##  Estimativa de Custo (Anual)

| Ferramenta | Tipo | Custo |
|-----------|------|-------|
| SonarQube | Open → Paid | $0 → $10k |
| OWASP ZAP | Open | $0 |
| Trivy | Open | $0 |
| Checkov | Open | $0 |
| Falco | Open | $0 |
| GitHub Actions | Paid | ~$1k |
| AWS (estimado) | Paid | ~$50k |
| **TOTAL** | - | **~$61k** |

**Conclusão:** Viável para budget de fintech de 40 devs

