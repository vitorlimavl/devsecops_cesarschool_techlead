# DevSecOps Pipeline — PIX API

**Aluno:** Vitor Lima | **Disciplina:** DevSecOps — CESAR School | **Professor:** Victor Lins

[![DevSecOps Pipeline](https://github.com/vitorlimavl/devsecops_cesarschool_techlead/actions/workflows/devsecops-pipeline.yml/badge.svg)](https://github.com/vitorlimavl/devsecops_cesarschool_techlead/actions/workflows/devsecops-pipeline.yml)

---

## Sobre o Projeto

API de transferências PIX desenvolvida em Node.js para demonstrar a implementação de uma pipeline DevSecOps completa com 7 stages, conforme laboratórios da disciplina.

---

## Pipeline DevSecOps

Ver execuções em: **[Actions Tab](https://github.com/vitorlimavl/devsecops_cesarschool_techlead/actions)**

```
Push/PR → ESLint → Jest → Semgrep → Docker+Trivy → Security Gate → ZAP → Deploy
```

### Stage 1 — ESLint (Linting)
- Analisa o código JavaScript em busca de erros de estilo e problemas de qualidade
- Regras de segurança habilitadas: `no-eval`, `no-implied-eval`, `no-new-func`
- Falha o pipeline se houver erros

### Stage 2 — Jest (Testes Automatizados)
- 11 testes cobrindo endpoints: health, balance, transfer, history
- Cobertura mínima exigida: 60% das linhas
- Relatório de cobertura exportado como artefato

### Stage 3 — Semgrep SAST (Static Analysis)
- Rulesets: `p/nodejs-security-audit`, `p/javascript`, `p/owasp-top-ten`
- Detecta: injection, hardcoded secrets, insecure patterns
- Resultados publicados no GitHub Security tab (SARIF)

### Stage 4 — Docker Build + Trivy (Container Scanning)
- Constrói imagem Docker com usuário não-root, healthcheck, resource limits
- Trivy escaneia a imagem por CVEs (CRITICAL, HIGH, MEDIUM)
- Relatório exportado como artefato e publicado no Security tab

### Stage 5 — Security Gate
- Só executa se os stages 1-4 passaram
- Consolida status de todos os checks de segurança
- Autoriza ou bloqueia o deploy

### Stage 6 — ZAP DAST (Dynamic Analysis)
- Inicia a aplicação em background
- ZAP Baseline Scan analisa a API em execução
- Detecta: missing headers, injection, authentication issues
- Report HTML e JSON exportados como artefatos

### Stage 7 — Deploy (Kubernetes dry-run)
- Valida os manifestos Kubernetes com `kubectl apply --dry-run`
- Executa apenas em push na branch `main`

---

## Estrutura do Repositório

```
.
├── .github/workflows/
│   └── devsecops-pipeline.yml    # Pipeline completa (7 stages)
├── src/
│   ├── index.js                  # App Express
│   ├── transfer.js               # Endpoints de transferência
│   └── utils/
│       └── validator.js          # Validação de input
├── tests/
│   └── transfer.test.js          # Testes Jest (11 testes)
├── k8s/
│   ├── deployment.yaml           # Deployment seguro (non-root, probes)
│   ├── service.yaml              # Service ClusterIP
│   └── network-policy.yaml      # NetworkPolicy restritiva
├── .zap/
│   └── rules.tsv                 # Regras ZAP customizadas
├── .eslintrc.json                # Configuração ESLint
├── Dockerfile                    # Build seguro (non-root, healthcheck)
├── .dockerignore
├── package.json
└── docs/                         # Documentação de suporte da disciplina
```

---

## Executar Localmente

```bash
# Instalar dependências
npm install

# Rodar testes
npm test

# Lint
npm run lint

# Iniciar aplicação
npm start

# Build Docker
docker build -t pix-api:local .
docker run -p 3000:3000 pix-api:local
```

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da aplicação |
| GET | `/api/balance/:userId` | Consulta saldo |
| POST | `/api/transfer` | Realiza transferência PIX |
| GET | `/api/transfers/:userId` | Histórico de transferências |

**Exemplo de transferência:**
```bash
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{"senderId":"user_001","recipientId":"user_002","amount":100}'
```

---

## Documentação de Suporte

| Documento | Conteúdo |
|-----------|----------|
| [docs/1_PIPELINE.md](./docs/1_PIPELINE.md) | Arquitetura da pipeline DevSecOps |
| [docs/2_FERRAMENTAS.md](./docs/2_FERRAMENTAS.md) | Ferramentas open source escolhidas |
| [docs/3_SLAs.md](./docs/3_SLAs.md) | Matriz de SLAs por severidade |
| [docs/4_ROADMAP.md](./docs/4_ROADMAP.md) | Roadmap L1 → L3 |
| [docs/5_SECURITY_CHAMPION.md](./docs/5_SECURITY_CHAMPION.md) | Modelo Security Champion |
| [docs/6_STRIDE.md](./docs/6_STRIDE.md) | Threat Modeling STRIDE |
