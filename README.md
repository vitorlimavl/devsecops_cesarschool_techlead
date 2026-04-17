# DevSecOps Pipeline - Fintech PIX API

Avaliação Técnica: Pipeline DevSecOps para API de Pagamentos PIX

**Contexto:**
- 5 Squads | 40 Devs
- Compliance: PCI DSS 4.0
- Stack: Node.js + Kubernetes + AWS
- Clientes: Bancos

---

##  Documentação

1. **[PIPELINE.md](./docs/1_PIPELINE.md)** - Pipeline ideal e ferramentas
2. **[FERRAMENTAS.md](./docs/2_FERRAMENTAS.md)** - Open source vs Comercial
3. **[SLAs.md](./docs/3_SLAs.md)** - Matriz SLA por severidade
4. **[ROADMAP.md](./docs/4_ROADMAP.md)** - Roadmap 6 meses (L1→L3)
5. **[SECURITY_CHAMPION.md](./docs/5_SECURITY_CHAMPION.md)** - Implementação
6. **[STRIDE.md](./docs/6_STRIDE.md)** - Exercício STRIDE

---

##  Resumo Executivo

**Abordagem:** Incrementalismo seguro com foco em PCI DSS 4.0

- **Mês 1-2:** SAST + DAST + Scanning (L1)
- **Mês 3-4:** Threat modeling + IaC scanning (L2)
- **Mês 5-6:** Runtime security + Auditorias contínuas (L3)

**Stack recomendado:** 80% open source + 20% comercial (AWS)

**Security Champion:** 1 por squad + 1 CTO-level
