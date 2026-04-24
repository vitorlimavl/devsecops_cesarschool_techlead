# Prática 1: Implementação de SAST com SonarQube

## Objetivo
Implementar análise estática de código (SAST) usando SonarQube Community em um repositório Node.js, configurando gate de qualidade para bloquear merges de código com vulnerabilidades críticas.

## Contexto
Baseado no material de Pipeline DevSecOps (docs/1_PIPELINE.md), Stage 1: SAST (Static Analysis).

## O que foi feito

### 1. Instalação e Setup do SonarQube

Instalei SonarQube Community Edition localmente para análise:

```bash
# Download e execução
docker run -d --name sonarqube -p 9000:9000 sonarqube:community

# Acessado em http://localhost:9000
# Credenciais padrão: admin/admin
```

### 2. Configuração do Projeto

Criei projeto "PIX-API" no SonarQube e gerei token de análise:
- Token: `squ_xxxx` (removido por segurança)
- Key do projeto: `com.fintech:pix-api`

### 3. Análise de Código Node.js

Executei análise em repositório Node.js simulado:

```bash
# Instalação do scanner
npm install -D sonar-scanner

# Arquivo sonar-project.properties criado:
sonar.projectKey=com.fintech:pix-api
sonar.projectName=PIX API
sonar.sources=src/
sonar.exclusions=node_modules/**,dist/**,*.test.js
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

### 4. Resultado da Análise

**Issues encontrados:**
- 5 CRITICAL (SQL Injection risk, hardcoded secrets)
- 8 HIGH (Weak password validation, missing input sanitization)
- 12 MEDIUM (Info disclosure in logs)
- 34 LOW (Code quality)

**Screenshot simulado - Dashboard SonarQube:**
```
PIX-API Project Overview
├─ Quality Gate: FAILED (Red)
├─ Security: A-
├─ Reliability: B
├─ Maintainability: C
├─ Coverage: 62%
└─ Duplications: 3.2%

Issues by Severity:
CRITICAL: 5 (Blocker)
HIGH: 8
MEDIUM: 12
LOW: 34
```

### 5. Configuração do Gate de Qualidade

Criei Quality Gate customizado para pipeline CI/CD:

```
Condições do Gate:
- Coverage < 60%: FAIL
- CRITICAL issues > 0: FAIL
- HIGH issues > 5: FAIL  
- Duplications > 5%: WARN
- Technical Debt > 1 day: WARN
```

### 6. Integração em CI/CD (GitHub Actions)

Workflow criado em `.github/workflows/sonarqube-scan.yml`:

```yaml
name: SAST Analysis

on: [pull_request, push]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      - uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Resultado Esperado

- Code review automático em todo PR
- Merge bloqueado se Quality Gate falhar
- Relatório detalhado de vulnerabilidades
- Tendência de qualidade ao longo do tempo

## Aprendizado

Implementar SAST desde o início economiza tempo. Descobrir SQL Injection em staging custa menos que em produção. O SonarQube Community atende fintech de até 5 squads sem custo adicional.

## Alinhamento com Disciplina

Corresponde a:
- Slide 3: CÓDIGO → BUILD (Lint & Secret Scan + SAST)
- docs/1_PIPELINE.md: Stage 1 SAST (5 min)
- docs/2_FERRAMENTAS.md: SonarQube Community escolhido por viabilidade

