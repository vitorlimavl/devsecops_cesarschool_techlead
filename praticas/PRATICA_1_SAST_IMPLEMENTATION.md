# Prática: SAST com Semgrep

**Lab:** Lab A4 Parte 1 — Static Analysis Security Testing  
**Evidência real:** [Stage 3 - Semgrep SAST no GitHub Actions](https://github.com/vitorlimavl/devsecops_cesarschool_techlead/actions)

---

## Ferramenta: Semgrep

O pipeline usa Semgrep (não SonarQube) como SAST, conforme os laboratórios da disciplina.

### Rulesets aplicados

```yaml
config: >-
  p/nodejs-security-audit
  p/javascript
  p/owasp-top-ten
```

### Workflow (`.github/workflows/devsecops-pipeline.yml`)

```yaml
sast-semgrep:
  name: "Stage 3 - Semgrep SAST"
  runs-on: ubuntu-latest
  permissions:
    security-events: write
  steps:
    - uses: actions/checkout@v4
    - uses: semgrep/semgrep-action@v1
      with:
        config: p/nodejs-security-audit p/javascript p/owasp-top-ten
        generateSarif: "1"
    - uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: semgrep.sarif
```

### O que o Semgrep detecta no código

O arquivo `src/transfer.js` contém um padrão de `console.log` com input do usuário não sanitizado — intencionalmente presente para demonstrar que o SAST identifica o problema.

### Resultados

Os findings são publicados automaticamente em:
`GitHub → Security → Code Scanning → Semgrep`

O relatório SARIF está disponível na Security Tab do repositório após cada execução.

---

## Conceito aplicado

SAST analisa o código-fonte estaticamente, sem executar a aplicação. O objetivo é detectar vulnerabilidades antes de qualquer build ou deploy — enquanto o custo de correção é mínimo.

No contexto do pipeline DevSecOps desta disciplina, o SAST ocorre no Stage 3, após linting (ESLint) e testes (Jest), e antes do Docker Build.
