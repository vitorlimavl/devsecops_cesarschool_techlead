# Narrativa Humana - DevSecOps Strategy: Protegendo o PIX na Nuvem

## INTRODUÇÃO: Por Que Estamos Aqui

Olha, a realidade é essa: quando você trabalha com PIX em 2026, você não está só construindo uma API. Você está gerenciando confiança em tempo real. Cada transação que passa por aqui é dinheiro de verdade saindo da conta de uma pessoa e entrando na conta de outra.

O que a gente está apresentando aqui não é um projeto de segurança. É um projeto de **viabilidade do negócio**. Porque sabe que acontece quando uma fintech sofre um ataque crítico? Não é só perda de dados — é perda de licença, multa de conformidade, marca destruída no mercado.

Então a gente desenhou isso em 6 meses porque fintech não tem luxo de ficar 2 anos "estudando segurança". Você precisa de proteção **agora**, maturidade **depois**, e excelência **sempre**. É incrementalismo, não é fé cega em metodologia. Quick wins na frente, arquitetura no meio, automação no fundo.

A stack que a gente escolheu (Node.js + K8s + AWS) não é acaso. É o que tá rodando em produção em fintech séria. E a gente sabe que 40 devs em 5 squads não conseguem seguir complexidade infinita — então tudo aqui foi feito pra ser simples, auditável, e **executável**.

---

## SLIDE 1: DevSecOps Strategy - Protegendo o PIX na Nuvem

"Um plano de execução de 6 meses para blindagem da stack (Node.js/K8s/AWS), mitigação de risco transacional e conformidade rigorosa com o PCI DSS 4.0."

Basicamente, a gente tá falando de três coisas aqui: **Alta Velocidade**, **Zero Gargalos**, **Secure by Design**.

Quando a gente diz "alta velocidade", não é só sobre deploy rápido. É sobre você conseguir colocar features seguras no mercado sem ficar esperando semanas de aprovação de segurança. O pipeline que a gente vai mostrar roda em 25 minutos.

"Zero gargalos" significa que a segurança não vira o gargalo do negócio. Não vira aquela história de "ah, a gente quer lançar, mas o security champion tá de férias e a gente fica preso". Segurança integrada, distribuída nos squads, automação onde é possível.

E "secure by design" é o mais importante. Porque a diferença entre um projeto que vai dar problema e um que vai ficar firme é se você pensa em segurança **durante** o design, não **depois**. Threat modeling no começo de uma feature custa 1 dia. Descobrir uma falha crítica em produção custa 10 dias + dano reputacional.

---

## SLIDE 2: As Ameaças Reais (STRIDE Aplicado)

Aqui a gente tá mostrando a arquitetura do PIX com as ameaças reais que um attacker tentaria explorar.

**SPOOFING (Fraude de Autenticação PIX):** É um cara conseguindo fazer uma transferência se passando por você. Ele rouba seu token JWT, ou consegue adivinhar sua senha. Isso é crítico porque PIX é imediato — não tem chance de reverter depois. A gente mitiga com 2FA forte, token com expiração curta (15 minutos), e device binding.

**DoS (Flood de Requests no Endpoint):** Alguém escreve um script e fica mandando 10 mil requisições por segundo. O servidor fica lento, usuários legítimos não conseguem fazer transação. A gente bloqueia com rate limiting agressivo — AWS WAF, circuit breaker no código, auto-scaling automático.

A grande questão aqui: **ferramentas encontram bugs no código. Threat modeling encontra falhas na ARQUITETURA.** Um SAST pode achar SQL injection. Mas ele nunca vai achar que você desenhou o fluxo de autorização errado. Isso é threat modeling.

Por isso: "Corrigir na fase de design é 100x mais barato." Se você descobre na produção que o fluxo tá quebrado, você precisa parar o sistema inteiro, fazer rollback, investigar quem foi afetado, notificar compliance. Rola R$ 500k+ fácil.

---

## SLIDE 3: O Pipeline - Código até Produção

Aqui a gente tá mostrando os 4 guardrails que todo commit passa:

**CÓDIGO:** Lint & Secret Scan. Procurando por coisa óbvia — credencial hardcoded, padrão ruim de código, vulnerable dependency.

**BUILD:** SAST & SCA. Aqui entra SonarQube (análise estática), npm audit (vulnerabilidades conhecidas), Trivy (scanning de imagem Docker). A gente pergunta: "Esse código tem vulnerabilidade conhecida?"

**REGISTRY:** Container Security. Imagem Docker antes de ir pro registry passa por scanning novamente. A gente não deixa uma imagem com vulnerabilidade crítica ir pra ECR.

**CLOUD:** DAST. Agora a imagem tá em staging, rodando de verdade. A gente manda um OWASP ZAP atacar a API simulando um attacker real — tentando SQL injection, XXS, autenticação fraca, tudo.

A mensagem final é crucial: "Nenhuma camada sozinha cobre todas as ameaças (STRIDE). O pipeline AUTOMATIZA a proteção e garante que o código só avança se estiver blindado."

---

## SLIDE 4: PCI DSS 4.0 - Open Source vs Comercial

Essa é a conversa mais importante financeira do projeto.

Conformidade PCI DSS é **mandatória** pro PIX. Você não escolhe. E quando se prepara pra auditoria, precisa provar que tem ferramentas de segurança. Aqui vem a pegadinha:

"Ferramentas comerciais são caras, mas vão me passar na auditoria mais fácil."

Mentira. O que o auditor quer é rastreabilidade. Se você usou SonarQube Community (open source) e documentou tudo, passou. Se usou Checkmarx (caro demais) mas não documentou, não passa.

Open source te dá auditoria **em código aberto**. Você explica pro auditor exatamente como funciona, porque o código tá lá. Comercial te dá suporte de vendor, mas **não é requisito pra PCI DSS**.

O trade-off é real:
- Open source: mais barato, mais auditável, comunidade forte, você precisa de ops skill
- Comercial: mais caro, menos transparência, suporte premium, menos burn-out

A gente escolheu 80% open source porque fintech de 40 devs não tem 200k/ano pra security tools. E porque open source é auditável. Ponto.

---

## SLIDE 5: SLAs por Severidade - Porque Velocidade Importa

Aqui a gente define: **se achar um bug crítico, quanto tempo você tem pra corrigir?**

CRITICAL (24 Horas): "Corrigir ou rollback imediato no K8s. Ex: RCE na API PIX."
- Uma vulnerabilidade que permite alguém executar código arbitrário. Catastrófico.
- Ação: você faz rollback imediato, ou faz patch de emergência em menos de 4 horas.

HIGH (7 Dias): "Priorização mandatória na sprint atual. Plano de mitigação ativo."
- Exemplo: Auth bypass com múltiplos passos. É possível, mas precisa de 5 cliques.
- Ação: Você prioriza isso na sprint que tá rodando, começa segunda-feira.

MEDIUM (30 Dias): "Inclusão no backlog da próxima sprint. Avaliação de impacto."
- Exemplo: XSS em um campo que ninguém usa muito. É uma falha, mas risco moderado.
- Ação: Entra no backlog, você resolve quando tiver tempo.

LOW (90 Dias): "Envio para backlog técnico ou aceitação formal de risco documentada."
- Exemplo: Um typo no comentário. Uma variável com nome ruim.
- Ação: Backlog de tech debt, resolve depois.

A coisa que muita gente não entende: **métricas não funcionam sem visibilidade**. Se você não conseguir medir quanto tempo leva pra passar de "encontramos uma vulnerabilidade" pra "vulnerability is fixed", você não tem compliance. PCI DSS exige isso. Tudo em dashboard do Jira. Executive consegue ver em tempo real.

---

## SLIDE 6: Segurança Centralizada vs Distribuída

Aqui vem o momento importante de **organização**.

MODELO CENTRALIZADO (Red X):
"GARGALO. 1 time isolado vs 10 squads. Segurança vira o time do 'não'."

Você tem 1 pessoa ou 1 time de segurança. 10 squads tentando fazer deploy. Todo deploy precisa de aprovação. Que acontece?
- Fila de espera cresce
- Devs ficam frustrados
- Segurança vira o vilão
- Quando alguém encontra um jeito de desviar, desviam

MODELO HUB & SPOKE (Green Check):
"ESCALA. 1 Security Champion por squad. Segurança distribuída sem travar o release."

Cada squad tem 1 campeão que foi treinado. Não é full-time — é um dev que entende OWASP Top 10 e consegue fazer code review com lentes de segurança. Aprovação fica mais rápida porque o champion tá ali.

E aqui tá a insight importante: "O Champion não é o responsável final. É o facilitador de design review e triage autônomo, com o Tech Lead atuando como sponsor."

Ele não é autoridade absoluta. É um facilitador. Ele diz "ó, isso aqui é risky, vamo pensar diferente?" e o tech lead valida junto. Não criamos um novo bottleneck. Distribuímos conhecimento.

---

## SLIDE 7: O Roadmap de Maturidade (L1 → L3)

MÊS 1 (L1: Base Ad-hoc):
"Setup do Pipeline básico (Lint + SCA) e identificação dos Champions voluntários."
- Coloca SonarQube rodando
- npm audit integrado
- Escolhe os 5 champions
- Longe de perfeito, mas vendo o que tá quebrado

MÊS 2-3 (L2: Ferramentas Ativas):
"Integração SAST + Secret Scan. Gate configurado (Bloqueio em Critical). Treinamento OWASP Top 10 para Champions."
- SAST bloqueia merge de código ruim
- Secret scanning apanha credencial antes de commitar
- Champions passaram por workshop
- Visibilidade real

MÊS 4-6 (L3: Automação Total):
"DAST ativo no K8s. Geração de SBOM para auditoria PCI. Champions realizam triage autônomo com suporte de SLAs em dashboard corporativo."
- DAST testa API de verdade
- Relatórios de conformidade automáticos
- Champions resolvem sozinhos
- PCI DSS 80% mapeado

A mensagem: "De respostas ad-hoc a pipelines que barram vulnerabilidades críticas automaticamente antes da produção."

---

## SLIDE 8: O Cofre Dinâmico - Go-To-Market Seguro

Final. Sumarizamos tudo em 3 pilares:

**1. TECNOLOGIA**
"Pipeline Enterprise DevSecOps. Proteção automatizada ponta-a-ponta, do Node.js à infraestrutura AWS."
- Tudo integrado, tudo falando junto
- Do commit até produção, passa por escaneamento automatizado

**2. PROCESSOS**
"Conformidade PCI DSS 4.0. SLA Crítico de 24h suportado por ferramentas comerciais especializadas de alta precisão."
- Não é "a gente acha que tá legal"
- Tem SLA, tem métrica, tem evidência
- Auditor consegue rastrear tudo

**3. PESSOAS**
"Escala Hub & Spoke. 1 Security Champion inserido em cada squad garantindo que o desenvolvimento nunca pare."
- Não é outsource de segurança
- Cada squad tem seu campeão
- Conhecimento distribuído

E a última frase é o budget request: "Iniciar rollout do projeto piloto hoje garante a conformidade regulatória plena da API PIX em exatamente 6 meses."

Traduzindo: "Se começar segunda-feira, em 6 meses o PIX tá blindado. Se esperar, o risco cresce, a janela regulatória fica apertada, compliance vira problema."

---

## CONCLUSÃO: O Pulo do Gato

Tá todo mundo falando em "shift-left" em segurança. "Ah, devs precisam pensar em segurança no design."

Verdade. Mas como você faz isso com 40 devs em 5 squads se ninguém foi treinado, se não tem ferramenta, se não tem tempo?

Resposta: você estrutura em L1 → L3. Começa com o básico (SAST), prova que funciona, treina pessoas, depois sobe sofisticação (threat modeling, DAST). Incrementalismo seguro.

Isso que a gente desenhou aqui não é ficção. É o que tá funcionando em fintech séria. A gente sabe porque literalmente copiou de startups que cresceram de zero a unicórnio sem ser hacked.

Então, o convite é esse: **em 6 meses, o PIX de vocês tá na nuvem, seguro, e auditável.**

Vamo?
