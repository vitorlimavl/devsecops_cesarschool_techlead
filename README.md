# DevSecOps Pipeline — PIX API

**Aluno:** Vitor Lima | **Disciplina:** DevSecOps — CESAR School | **Professor:** Victor Lins

[![DevSecOps Pipeline](https://github.com/vitorlimavl/devsecops_cesarschool_techlead/actions/workflows/devsecops-pipeline.yml/badge.svg)](https://github.com/vitorlimavl/devsecops_cesarschool_techlead/actions/workflows/devsecops-pipeline.yml)

---

## Evidências por Laboratório

| Lab | Ferramenta | Evidência no Pipeline | Artifact / Link |
|-----|-----------|----------------------|-----------------|
| Lab A2 - GitHub Actions | GitHub Actions | Aba [Actions](https://github.com/vitorlimavl/devsecops_cesarschool_techlead/actions) | Runs visíveis |
| Lab A4 Parte 0 - ESLint | ESLint | Stage 1 - ESLint | Log do job |
| Lab A4 Parte 0 - Testes | Jest + Coverage | Stage 2 - Jest Tests | Artifact: `coverage-report` |
| Lab A4 Parte 1 - SAST | Semgrep | Stage 3 - Semgrep SAST | GitHub Security tab + SARIF |
| Lab A4 Parte 1 - Docker | Docker Build | Stage 5 - Docker Build | Log do job |
| Lab A4 Parte 2 - Container Scan | Trivy | Stage 5 - Trivy | Artifact: `trivy-container-report` |
| Lab A5 Parte 1 - CI/CD completo | Security Gate | Stage 7 - Security Gate | Log do job |
| Lab A5 Parte 2 - DAST | ZAP | Stage 8 - ZAP DAST | Artifact: `zap-report` |
| Lab A6 Parte 1 - IaC Scan | Checkov + Trivy config | Stage 4 - IaC Scan | Artifacts: `iac-checkov-report`, `iac-trivy-report` |
| Lab A6 Parte 2 - SBOM | Syft (CycloneDX + SPDX) | Stage 6 - SBOM | Artifact: `sbom-reports` |
| Kubernetes | kubeconform + manifestos | Stage 9 - Deploy | Artifact: `kubernetes-validation-report` |

---

## Pipeline DevSecOps — 9 Stages

```
Push/PR
  │
  ├─[S1] ESLint ─────────────────────────────────────────┐
  ├─[S2] Jest Tests ──────────────────────────────────────┤→[S5] Docker+Trivy→[S6] SBOM─┐
  ├─[S3] Semgrep SAST ────────────────────────────────────┘                              │
  │                                                                                       │
  └─[S4] IaC Scan (Checkov+Trivy config) ─────────────────────────────────────────────→[S7] Security Gate
                                                                                          │
                                                                                         [S8] ZAP DAST
                                                                                          │
                                                                                         [S9] Deploy (kubeconform)
```

### Stage 1 — ESLint
- Analisa código JavaScript com regras de segurança: `no-eval`, `no-implied-eval`, `no-new-func`
- **Resultado:** 0 erros, 3 warnings (`no-console` intencional)

### Stage 2 — Jest Tests
- **13 testes** cobrindo: health, balance, transfer, history, validações de input
- Cobertura: **88%** (threshold mínimo: 60%)
- Artifact exportado: `coverage-report/`

### Stage 3 — Semgrep SAST
- Rulesets: `p/nodejs-security-audit`, `p/javascript`, `p/owasp-top-ten`
- Resultados publicados no GitHub Security tab (SARIF)
- Detecta: injection patterns, hardcoded secrets, insecure API calls

### Stage 4 — IaC Scan (Checkov + Trivy config)
- **Checkov** escaneia `k8s/` contra políticas de segurança Kubernetes
- **Trivy config** scan dos manifestos YAML
- Artifacts exportados: `iac-checkov-report`, `iac-trivy-report`

### Stage 5 — Docker Build + Trivy
- Build com usuário não-root, HEALTHCHECK, read-only filesystem
- Trivy escaneia CVEs na imagem (CRITICAL, HIGH, MEDIUM)
- SARIF publicado no GitHub Security tab
- Artifact: `trivy-container-report`

### Stage 6 — SBOM (Software Bill of Materials)
- **Syft** gera inventário completo de dependências da imagem
- Formato **CycloneDX JSON** (padrão NIST/OWASP)
- Formato **SPDX JSON** (padrão Linux Foundation)
- Artifact: `sbom-reports/` (sbom-cyclonedx.json + sbom-spdx.json)

### Stage 7 — Security Gate
- Só executa após Stages 4, 5 e 6 passarem
- Consolida status de todos os checks de segurança
- Autoriza ou bloqueia o deploy

### Stage 8 — ZAP DAST
- Inicia a aplicação em background na porta 3000
- ZAP Baseline Scan analisa a API em execução
- Detecta: missing security headers, injection risks
- Artifact: `zap-report/` (report_html.html + report_json.json)

### Stage 9 — Deploy (Kubernetes)
- **kubeconform** valida os schemas Kubernetes sem precisar de cluster
- Valida: `deployment.yaml`, `service.yaml`, `network-policy.yaml`
- Artifact: `kubernetes-validation-report/`
- Executa apenas em push na branch `main`

---

## Estrutura do Repositório

```
.
├── .github/workflows/
│   └── devsecops-pipeline.yml    # Pipeline (9 stages)
├── src/
│   ├── index.js                  # App Express (rate limiting, error handling)
│   ├── transfer.js               # Endpoints PIX: balance, transfer, history
│   └── utils/
│       └── validator.js          # Validação de inputs
├── tests/
│   └── transfer.test.js          # 13 testes Jest
├── k8s/
│   ├── deployment.yaml           # Deployment (non-root, probes, resource limits)
│   ├── service.yaml              # Service ClusterIP
│   └── network-policy.yaml      # NetworkPolicy restritiva
├── .zap/
│   └── rules.tsv                 # Regras ZAP customizadas
├── .eslintrc.json                # ESLint com regras de segurança
├── Dockerfile                    # Build seguro (non-root, healthcheck)
├── package.json                  # Scripts: test, lint, start
└── docs/                         # Documentação de suporte da disciplina
```

---

## Executar Localmente

```bash
npm install
npm test          # Jest (13 testes, 88% cobertura)
npm run lint      # ESLint
npm start         # API na porta 3000
```

---

## Endpoints da API PIX

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da aplicação |
| GET | `/api/balance/:userId` | Consulta saldo |
| POST | `/api/transfer` | Realiza transferência PIX |
| GET | `/api/transfers/:userId` | Histórico de transferências |

```bash
# Exemplo de transferência
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{"senderId":"user_001","recipientId":"user_002","amount":100}'
```

---

## Artifacts Gerados por Run

Cada execução do pipeline exporta os seguintes artifacts (90 dias de retenção):

| Artifact | Conteúdo |
|----------|----------|
| `coverage-report` | Relatório HTML de cobertura Jest |
| `iac-checkov-report` | Resultados do Checkov nos manifestos K8s |
| `iac-trivy-report` | Resultados do Trivy config scan |
| `trivy-container-report` | CVEs encontrados na imagem Docker |
| `sbom-reports` | SBOM em CycloneDX + SPDX |
| `zap-report` | Relatório DAST do ZAP (HTML + JSON) |
| `kubernetes-validation-report` | Saída do kubeconform por manifesto |

---

## GitHub Security Tab

Findings do Semgrep e Trivy são publicados automaticamente em:
`GitHub → Security → Code Scanning`

Inclui: SARIF de vulnerabilidades encontradas em código e na imagem Docker.

---

## Documentação de Suporte

| Documento | Conteúdo |
|-----------|----------|
| [docs/1_PIPELINE.md](./docs/1_PIPELINE.md) | Arquitetura da pipeline DevSecOps |
| [docs/2_FERRAMENTAS.md](./docs/2_FERRAMENTAS.md) | Ferramentas open source |
| [docs/3_SLAs.md](./docs/3_SLAs.md) | Matriz de SLAs por severidade |
| [docs/4_ROADMAP.md](./docs/4_ROADMAP.md) | Roadmap L1 → L3 |
| [docs/5_SECURITY_CHAMPION.md](./docs/5_SECURITY_CHAMPION.md) | Modelo Security Champion |
| [docs/6_STRIDE.md](./docs/6_STRIDE.md) | Threat Modeling STRIDE |
