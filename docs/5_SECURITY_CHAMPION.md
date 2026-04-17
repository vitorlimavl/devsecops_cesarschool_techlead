# 5. Security Champion: Implementação e Papel

**Modelo:** 5 Champions (1 por squad) + 1 Global (CTO-level)

---

##  Definição

**Security Champion** é um desenvolvedor designado que atua como:
1. **Multiplicador** de conhecimento de segurança no squad
2. **Gatekeeper** de aprovações de segurança em PRs
3. **Link** entre dev e CTO/Security team
4. **Educador** em threat modeling e design seguro

> Não é um "segurança policial". É um **trusted advisor** técnico.

---

##  Competências Requeridas

### **Mínimo (L1)**
- 3+ anos de experiência em desenvolvimento
- Comfortable com conceitos OWASP Top 10
- Able to read security reports + act
- Good communication skills
- Passion for learning security

### **Ideal (L2-L3)**
- CTF experience ou bug bounty
- Conhecimento de alguma ferramenta SAST
- Experiência com compliance (PCI, SOC2)
- Mentalidade de "attacker"
- Alguma certificação (OSCP, CEH) - Nice to have

---

##  Papel por Squad

### **Squad Champions (4-5 pessoas)**

**Tempo dedicado:** 10-15% (2-3 horas/semana)

**Responsabilidades:**

#### 1. Code Review de Segurança
- Validar SonarQube issues foram resolvidas
- Confirmar testes de segurança adicionados
- Verificar dados sensíveis não foram logados
- Input validation está presente
- Autenticação/autorização adequadas

#### 2. Threat Modeling
- Antes de features críticas
- Desenhar diagrama de componentes
- Aplicar STRIDE
- Documentar risks

#### 3. Conhecimento & Educação
- Revisar CVEs da semana
- Dar talk sobre vulnerability encontrada
- Atualizar security guidelines
- Responder dúvidas de segurança

#### 4. Escalação
- Comunicar ao Global Champion
- Parar o deploy se necessário
- Criar incident GitHub

---

##  Global Champion (1 pessoa)

**Tempo dedicado:** 40-50% (2 dias/semana)

**Responsabilidades:**

#### 1. Governance & Policy
- Criar/atualizar security policies
- Manter security guidelines
- Definir SLAs por severidade
- Compliance checklist (PCI DSS)

#### 2. Mentor dos Squad Champions
- Retrospectiva semanal
- Treinamento técnico
- Calibração de severidade
- Discussão de threat models

#### 3. Incident Management
- Lead da incident response
- Coordenar fix + deploy
- Comunicar stakeholders
- Post-mortem facilitador

#### 4. Compliance & Auditoria
- Dashboard de métricas
- PCI DSS gap analysis
- Evidence collection para auditor
- Relatório mensal

#### 5. Supply Chain & Dependencies
- Revisar CVEs em dependências
- Aprovar/rejeitar updates
- Audit de novo packages

---

##  Implementação - 4 Fases

### **Fase 1: Seleção (Semana 1)**

**Critério:**
- Developer sênior no squad
- Interesse em segurança (voluntário!)
- Disponibilidade 10-15% tempo

### **Fase 2: Treinamento Rápido (Semanas 2-4)**

**Agenda:**
- Dia 1: OWASP Top 10 + PCI DSS basics
- Dia 2: SonarQube workshop (hands-on)
- Dia 3: STRIDE + threat modeling
- Dia 4: Incident response + policies
- Dia 5: Role-playing (encontrar vulns)

### **Fase 3: Autonomia Gradual (Semanas 5-8)**

**Semana 5-6:** Champion com mentor em paralelo
**Semana 7-8:** Champion lidera, mentor observa
**Semana 9+:** Champion autonomia, check-in semanal

### **Fase 4: Escalada & Certificação (Semanas 9+)**

**Desenvolvimento contínuo:**
- Threat modeling independently
- Mentoring outros devs
- Apresentações em townhalls

---

##  Responsabilidades Detalhadas

### **Code Review Checklist**

```markdown
## Security Review Checklist

### Authentication & Authorization
- [ ] Força de senha atualizada?
- [ ] MFA considerado?
- [ ] Permissões granulares?

### Input Validation
- [ ] Todos os inputs validados?
- [ ] SQL Injection protection?
- [ ] File upload validado?

### Data Protection
- [ ] Dados sensíveis encriptados?
- [ ] TLS 1.2+ em transit?
- [ ] PII não logado?

### Error Handling
- [ ] Mensagens de erro genéricas?
- [ ] Stack traces não expostos?
```

---

##  Métricas de Sucesso

**Por Squad Champion:**
- Code review latency: < 15 min (target: 95%)
- Finding accuracy: 90%+ (não reportar falsos positivos)
- Education: 1 talk/mês
- Team satisfaction: 8/10 (survey)

**Global Champion:**
- Incident response time: CRITICAL < 30 min
- Compliance gap: < 15% (PCI DSS)
- Champions retention: 100% (não burn out)
- Developer training: 95% done/ano

---

##  Começar Hoje

**Próximos passos:**
1. [ ] Identificar 5 devs para serem Champions
2. [ ] Conversa 1:1 (vender o benefício)
3. [ ] Primeira reunião sync (1h)
4. [ ] OWASP Top 10 video workshop (30 min)
5. [ ] Shadow 2-3 code reviews existentes
6. [ ] Primeira code review com mentor observando

