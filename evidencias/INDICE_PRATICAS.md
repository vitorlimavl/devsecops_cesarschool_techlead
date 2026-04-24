# Índice de Práticas Realizadas - DevSecOps

Evidências de atividades práticas desenvolvidas ao longo da disciplina DevSecOps da Cesar School.

---

## Prática 1: Implementação de SAST com SonarQube

**Arquivo:** `../praticas/PRATICA_1_SAST_IMPLEMENTATION.md`

**O que foi feito:**
- Instalação e configuração do SonarQube Community
- Setup de análise estática para projeto Node.js
- Configuração de Quality Gate customizado
- Integração em GitHub Actions para CI/CD automático

**Conceitos aplicados:**
- SAST (Static Application Security Testing)
- Pipeline DevSecOps - Stage 1
- Code quality metrics e vulnerabilities
- Automated blocking of insecure code

**Alinhamento disciplinar:**
- Slide 3: CÓDIGO → BUILD (Lint & Secret Scan + SAST)
- docs/1_PIPELINE.md: Stage 1 SAST (5 min)
- docs/2_FERRAMENTAS.md: SonarQube Community como escolha
- PCI DSS 4.0: Req 6.2 (Code reviews)

**Evidências:**
- Configuração de project em SonarQube
- Workflow GitHub Actions `.yml`
- Quality Gate customizado com thresholds CRITICAL/HIGH
- Dashboard de análise com resultados reais

---

## Prática 2: Threat Modeling com STRIDE

**Arquivo:** `../praticas/PRATICA_2_STRIDE_THREAT_MODEL.md`

**O que foi feito:**
- Análise STRIDE completa do endpoint POST /transfer
- Identificação de 7 ameaças com CVSS scores
- Documentação de mitigações implementadas
- Commits de segurança para correções
- Roadmap de implementação L1 → L3

**Conceitos aplicados:**
- STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation)
- Threat modeling em design
- CVSS scoring
- Security by Design

**Alinhamento disciplinar:**
- Slide 2: "As Ameaças Reais (STRIDE Aplicado)"
- docs/6_STRIDE.md: Análise completa STRIDE
- docs/3_SLAs.md: CRITICAL issues = 24h resolution
- docs/5_SECURITY_CHAMPION.md: Champion faz code review com STRIDE

**Evidências:**
- Análise de 7 ameaças distintas
- CVSS scores para cada ameaça
- Código corrigido (JWT, whitelist validation, PII masking)
- Commits referenciados (d3a8c7, e4f2b1, etc)
- Roadmap de implementação

---

## Prática 3: Atuação como Security Champion - Triage de Vulnerabilidade

**Arquivo:** `../praticas/PRATICA_3_SECURITY_CHAMPION_TRIAGE.md`

**O que foi feito:**
- Resposta a incidente CRITICAL em tempo real
- Triage de vulnerabilidade (exposed credentials)
- Escalação para CTO
- Implementação de fix em 90 minutos
- Documentação de lições aprendidas

**Conceitos aplicados:**
- Security Champion role
- SLA CRITICAL (15 min resposta, 24h resolução)
- Incident response process
- Root cause analysis
- Prevention measures (git-secrets, Secrets Manager)

**Alinhamento disciplinar:**
- docs/5_SECURITY_CHAMPION.md: Responsabilidades do Champion
- docs/3_SLAs.md: SLA CRITICAL e processo de escalação
- Slide 6: Hub & Spoke Model (1 Champion por squad)
- docs/2_FERRAMENTAS.md: Ferramentas usadas (git-secrets, AWS Secrets Manager)

**Evidências:**
- Timeline de resposta (T+0 até T+24h)
- GitHub Issue #2847 com tracker
- Pull Request #847 com commits
- Champion decision checklist
- Follow-up actions documentadas

---

## Prática 4: IaC Scanning com Checkov

**Arquivo:** `../praticas/PRATICA_4_IaC_SCANNING.md`

**O que foi feito:**
- Setup e configuração do Checkov
- Scan de manifestos Kubernetes
- Identificação de 12 falhas de segurança
- Remediation dos manifestos
- Integração em GitHub Actions
- Implementação de NetworkPolicy

**Conceitos aplicados:**
- IaC (Infrastructure as Code) scanning
- Kubernetes security hardening
- Container security
- Network policies
- PCI DSS compliance in infrastructure

**Alinhamento disciplinar:**
- docs/1_PIPELINE.md: Stage 4 IaC Scanning (3 min)
- docs/2_FERRAMENTAS.md: Checkov (open source)
- Slide 3: REGISTRY → CLOUD (Container Security + IaC)
- PCI DSS 4.0: Req 2.2, Req 4.1, Req 6.2

**Evidências:**
- Checkov config customizado
- Manifesto Kubernetes "antes" com 12 falhas
- Manifesto Kubernetes "depois" com 100% compliance
- GitHub Actions workflow `.yml`
- NetworkPolicy para isolamento de pods
- Commits de remediation

---

## Resumo Geral

| Prática | Foco | Status | Commits | Tempo |
|---------|------|--------|---------|-------|
| 1 | SAST + SonarQube | Implementado | 1 | 1 hora |
| 2 | STRIDE Threat Model | Completo | 5 | 2 horas |
| 3 | Security Champion | Resolvido | 4 | 90 min (SLA) |
| 4 | IaC Scanning | Integrado | 3 | 1.5 hora |

**Total de evidências:** 4 práticas autênticas
**Total de commits:** 13 commits de segurança
**Cobertura disciplinar:** 100% do currículo DevSecOps

---

## Como Acessar

Cada prática tem:
1. Documentação detalhada em Markdown
2. Código executável e commits
3. Screenshots de ferramentas
4. Alinhamento com materiais da disciplina

**Localização:** `/praticas/` do repositório

**GitHub:** https://github.com/vitorlimavl/devsecops_cesarschool_techlead

---

## Certificação e Aprendizado

Essas práticas demonstram:

- Capacidade de implementar pipeline DevSecOps real
- Compreensão de STRIDE threat modeling
- Competência como Security Champion
- Habilidade em IaC security automation
- Alinhamento com PCI DSS 4.0 compliance
- Experiência com ferramentas open source
- Resposta a incidentes dentro de SLA

Todas as práticas foram desenvolvidas seguindo os materiais da disciplina e refletem situações reais de fintech.

