# Prática 3: Atuação como Security Champion - Triage de Vulnerabilidade CRITICAL

## Objetivo
Documentar processo de triage e resposta a uma vulnerabilidade CRITICAL encontrada em produção, seguindo SLA e padrões definidos para Security Champion.

## Contexto
Baseado em:
- docs/5_SECURITY_CHAMPION.md: Responsabilidades do Champion
- docs/3_SLAs.md: SLA CRITICAL = 15 min resposta, 4h resolução
- Slide 6: Modelo Hub & Spoke (1 Champion por squad)

---

## 1. Incidente: Secrets Detectados em Repositório

**Timestamp:** 2026-04-16 10:42 UTC

**Detecção:** GitHub Secret Scanner alertou sobre AWS credentials em `config/.env.production`

**Screenshot simulado - GitHub Alert:**
```
Security alert: Exposed credentials detected

Type: AWS Access Key
Location: config/.env.production (line 24)
Severity: CRITICAL
Secret exposed to: Public repository
Time exposed: ~3 horas

Key detected: AKIA7XXXXXXXXXXX
Recomm: Revoke immediately
```

---

## 2. Acionamento e Resposta (T+0 a T+15min)

### T+2 min - Notificação recebida
```
Slack #security-incidents:
[Bot] CRITICAL ALERT: AWS credentials exposed in main branch
Arquivo: config/.env.production
Tempo exposição: 3 horas
Ação: Imediata
CC: @squad-payments @tech-lead @cto
```

### T+5 min - Champion Investigation
Como Security Champion da squad de Payments, iniciei investigação:

1. **Verificar escopo de exposição:**
   - Repositório estava público por 3 horas
   - 127 clones durante exposição
   - Credenciais tinham acesso: S3, RDS, Lambda

2. **Assessment de impacto:**
   ```
   Risco: CRÍTICO (9.5 CVSS)
   Contas afetadas: Production AWS Account
   Possível exposição: Dados de clientes em RDS
   Ações de ataque detectadas: Nenhuma (aparentemente)
   ```

3. **Acionamento de escalação:**
   - CTO notificado em T+7 min
   - DBA acionado para monitorar DB
   - Compliance team notificado

---

## 3. Plano de Ação (T+15min - Aprovado)

### FASE 1: Containment (T+15 até T+30)

**Actions:**
```
[ ] 1. Tornar repo privado IMEDIATAMENTE
  └─ Executado em T+12 min
  
[ ] 2. Revogar AWS keys expostas
  └─ CTO revogou em T+18 min via AWS Console
  
[ ] 3. Criar novas credentials seguras
  └─ Novas keys geradas em T+25 min
  
[ ] 4. Scan de logs AWS CloudTrail
  └─ DBA checando acesso anômalo
  
[ ] 5. Notificar clientes? 
  └─ Avaliando: não detectados acessos não-autorizados
```

### FASE 2: Fix (T+30 até T+120)

**Code changes:**
```
Branch: hotfix/remove-exposed-secrets
Commits:

1) Remove .env.production do git history
   git filter-branch --tree-filter 'rm -f config/.env.production'
   
2) Add .env.production to .gitignore
   echo "config/.env.production" >> .gitignore
   
3) Update to use AWS Secrets Manager
   # Before: require('config/.env.production')
   # After: fetch from AWS Secrets Manager
   
4) Add git-secrets pre-commit hook
   npm install -D git-secrets
   git secrets --install
```

---

## 4. Decisão e Documentação

### Classificação (Champion Decision)

```markdown
SEVERITY: CRITICAL
CVSS: 9.5 (Confidentiality: High, Integrity: High, Availability: High)
SLA: 24 horas para resolução

Root Cause: Developer committed .env file por erro humano

Contributing Factors:
- .env.production não estava em .gitignore
- Sem pre-commit hook para bloquear secrets
- Repo era público (por qual motivo?)

Prevention for Future:
1. Obrigatório git-secrets em todos os projetos
2. Pre-commit hook bloqueia .env files
3. Repos devem ser PRIVATE por padrão
4. Secrets em AWS Secrets Manager, nunca em código
```

### Champion Review Checklist

Conforme docs/5_SECURITY_CHAMPION.md - Code Review Checklist:

```
[X] Authentication & Authorization
    - Credentials now in Secrets Manager (not code)
    - AWS keys revoked and rotated
    
[X] Input Validation
    - N/A (não é sobre input)
    
[X] Data Protection
    - Secrets removed from git history
    - New keys encrypted in transit
    
[X] Error Handling
    - Error messages don't expose secret paths
    
[X] Dependencies
    - git-secrets added to package.json
    - npm audit clean
    
[X] Compliance
    - PCI DSS: Secrets não podem estar em repo
    - This fix addresses Req 8.2 (Secret Management)
```

---

## 5. Commits e Pull Request

### Commits realizados:

```bash
a7f3c1 - CRITICAL: Remove exposed AWS credentials from git history
a7f3c2 - feat: Integrate AWS Secrets Manager for credentials
a7f3c3 - feat: Add git-secrets pre-commit hook
a7f3c4 - docs: Update SECURITY.md with secret management policy
```

### Pull Request #847

**Title:** `[CRITICAL] Remove exposed secrets and integrate AWS Secrets Manager`

**Description:**
```markdown
## Summary

Responded to CRITICAL security incident: AWS credentials were 
exposed in config/.env.production for ~3 hours.

## Changes

1. Remove .env.production from git history using git filter-branch
2. Implement AWS Secrets Manager for credential storage
3. Add git-secrets pre-commit hook to prevent future exposure
4. Update documentation with secret management best practices

## Impact

- Fixes CVSS 9.5 vulnerability (credential exposure)
- Prevents similar incidents via automation
- Aligns with PCI DSS Req 8.2

## Testing

- [x] git-secrets detects mock credentials
- [x] AWS Secrets Manager integration tested
- [x] Application starts with new credential sources
- [x] No breaking changes to existing code

## SLA Compliance

- Detection: T+0 (GitHub Secret Scanner)
- Initial Response: T+5 min (Champion investigation)
- Plan Approval: T+15 min (CTO sign-off)
- Code Fix: T+90 min
- **SLA Target: 24h | Actual: 90 min** ✅

## Reviewer Notes

As Security Champion, I verified:
- Root cause analysis complete
- All preventive measures in place
- No similar patterns in codebase
- Team trained on new secret management
```

**Status:** MERGED ✅
**Merged by:** CTO
**Approvals:** 2 (Champion + Tech Lead)

---

## 6. Follow-up Actions (T+4h até T+24h)

### Comunicação
```
T+4h - Update aos stakeholders:
From: Security Champion
To: Squad Payments, CTO, Compliance

Subject: CRITICAL Incident Resolved - Exposed AWS Credentials

Status: RESOLVED
Resolution time: 90 minutes (SLA: 24h)
Root cause: git commit of .env file
Prevention: git-secrets + Secrets Manager implemented
Customer impact: None detected
New key rotation: Complete
```

### Lessons Learned
```
1. O que deu certo:
   - Detecção automática (GitHub Secret Scanner) funcionou
   - Resposta rápida da squad
   - Clear escalation path
   
2. O que melhorar:
   - Pre-commit hook deveria ter bloqueado antes
   - .env.production não deveria estar em repo (process failure)
   - Onboarding: novo dev não sabia da política
   
3. Ações:
   - Revisar onboarding security checklist
   - Implementar git-secrets em todos os repos (automation)
   - Training obrigatório de secret management
```

---

## 7. Evidência de Tickets/Issues

### GitHub Issue #2847 (Criado automaticamente)

```
Title: SECURITY: AWS Credentials Exposed in Repository

Type: Security Incident
Severity: Critical
Status: Resolved ✅

Timeline:
- Created: 2026-04-16 10:42 UTC (auto)
- Acknowledged: 2026-04-16 10:47 UTC (Champion)
- Fixed: 2026-04-16 12:12 UTC (PR merged)
- Closed: 2026-04-16 13:00 UTC

Related PR: #847
Related commits: a7f3c1, a7f3c2, a7f3c3, a7f3c4

Assignees: @champion-squad-payments, @tech-lead
Labels: security, incident, critical, resolved
```

---

## 8. Alinhamento com Disciplina

### docs/5_SECURITY_CHAMPION.md
- ✅ Code Review de Segurança (Threat assessment)
- ✅ Escalação (CTO informado em T+7)
- ✅ Responsabilidades (Triage autônomo)
- ✅ Security Champion facilitador, não "policial"

### docs/3_SLAs.md - CRITICAL SLA
- ✅ Resposta: 15 min (atingido em 5 min)
- ✅ Resolução: 24h (atingido em 90 min)
- ✅ Escalação: CEO/CISO (CTO acionado)

### Slide 6: Hub & Spoke Model
- ✅ Champion distribuído no squad
- ✅ Desenvolvimento nunca parou
- ✅ Security decision autônoma
- ✅ Tech Lead como sponsor

### docs/2_FERRAMENTAS.md - Ferramentas Usadas
- ✅ GitHub Secret Scanner (built-in)
- ✅ git-secrets (open source)
- ✅ AWS Secrets Manager (compliance)

