# Prática: Atuação como Security Champion

**Lab:** Referência ao modelo Hub & Spoke e SLAs da disciplina  
**Documentação de suporte:** [docs/5_SECURITY_CHAMPION.md](../docs/5_SECURITY_CHAMPION.md)

---

## Conceito: Security Champion

O Security Champion é o responsável técnico por segurança dentro de um squad de desenvolvimento. Não é um papel de "policia de segurança", mas de facilitador — alguém com conhecimento técnico suficiente para:

- Fazer code review com olhar de segurança
- Triagem de vulnerabilidades detectadas por ferramentas automatizadas
- Escalar para o time de segurança quando necessário
- Garantir que o time siga os SLAs definidos

---

## Aplicação Prática no Pipeline

Neste repositório, o papel do Security Champion está operacionalizado pela própria pipeline DevSecOps:

### Detecção automática de vulnerabilidades

```
Semgrep (Stage 3)  → identifica vulnerabilidades no código
Trivy   (Stage 5)  → identifica CVEs na imagem Docker
Checkov (Stage 4)  → identifica misconfigurações em K8s
ZAP     (Stage 8)  → identifica vulnerabilidades em runtime
```

### Security Gate (Stage 7)

O Security Gate implementa a decisão que o Security Champion tomaria manualmente:
- Se algum stage de segurança falhar com severidade CRITICAL, o deploy não ocorre
- A decisão de bloquear ou deixar passar está codificada nas regras do pipeline

### SLAs operacionalizados

Conforme `docs/3_SLAs.md`, vulnerabilidades CRITICAL devem ser resolvidas em até 24 horas. Na pipeline, isso se traduz em:
- Bloqueio imediato de merge com vulnerabilidade CRITICAL
- Notificação automática via GitHub (Status Check obrigatório)
- Nenhum deploy acontece enquanto o gate não for verde

---

## Processo de Resposta a Incidente

O fluxo de resposta a uma vulnerabilidade detectada pelo pipeline segue este processo:

1. **Detecção:** Ferramenta de segurança identifica o problema (Semgrep, Trivy, ZAP)
2. **Notificação:** GitHub Actions marca o commit com status `FAILURE`
3. **Triagem:** Developer/Champion analisa o finding no log ou na Security Tab
4. **Classificação:** CRITICAL/HIGH → bloqueia. MEDIUM/LOW → reporta.
5. **Correção:** Fix commitado, pipeline re-executa
6. **Validação:** Security Gate verde = correção confirmada

---

## Alinhamento com o Material da Disciplina

| Conceito | Onde está implementado |
|----------|----------------------|
| Hub & Spoke | Pipeline centralizada, um workflow para todos os squads |
| SLA CRITICAL 24h | Security Gate bloqueia merge até resolução |
| Code review de segurança | Semgrep e ESLint em todo PR |
| Escalação | GitHub Status Check notifica automaticamente |
| Audit trail | Histórico completo em GitHub Actions |
