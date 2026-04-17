# Narrativa de Apresentação - DevSecOps Strategy: Protegendo o PIX na Nuvem

---

## ABERTURA

Boa noite professor. Vamos apresentar uma estratégia de DevSecOps para uma API de pagamentos PIX. O cenário que recebemos foi claro: uma fintech com 40 desenvolvedores em 5 squads, operando em Node.js com Kubernetes na AWS, com conformidade obrigatória em PCI DSS 4.0.

Escolhemos esse escopo porque reflete a realidade de fintechs em produção. Não é um caso hipotético. É o stack que está funcionando em empresas como essa que precisam lidar com transações reais, dados sensíveis de clientes, e requisitos regulatórios rígidos.

A proposta é um plano de 6 meses — não porque seja o tempo mínimo, mas porque é realista. Segurança em fintech não se constrói em 2 semanas, mas também não pode ficar esperando anos. Precisamos de proteção agora, maturidade depois, excelência ao final.

---

## SLIDE 1: DevSecOps Strategy - Protegendo o PIX na Nuvem

"Um plano de execução de 6 meses para blindagem da stack (Node.js/K8s/AWS), mitigação de risco transacional e conformidade rigorosa com o PCI DSS 4.0."

O que a gente está propondo aqui tem três objetivos principais: Alta velocidade de deploy, zero gargalos administrativos, e segurança integrada no design.

Alta velocidade não significa "soltar código sem checagem". Significa que um desenvolvedor consegue enviar uma feature segura para produção sem ficar esperando semanas por aprovação de segurança. O pipeline que vamos mostrar roda em 25 minutos do commit até a decisão de deploy.

Zero gargalos significa que segurança não vira o vilão que atrasa o negócio. Não é aquela situação onde um projeto inteiro fica preso porque o responsável por segurança tá indisponível. A segurança fica distribuída nos squads, com automação onde é possível.

E segurança integrada no design é o ponto crítico. A diferença entre um projeto que vai ter problemas e um que vai ser robusto é pensar em segurança durante a arquitetura, não depois de pronto. Quando você faz threat modeling no começo de uma feature, custa um dia de trabalho. Quando descobrem uma falha de autorização em produção, custam 10 dias mais dano reputacional. A matemática é simples.

---

## SLIDE 2: As Ameaças Reais — STRIDE Aplicado

Aqui estamos analisando a arquitetura PIX com as ameaças que um atacante tentaria explorar.

Começando com SPOOFING: é quando alguém consegue fazer uma transação fingindo ser outro usuário. Rouba o token JWT, ou consegue descobrir a senha. Isso é crítico no PIX porque é imediato — não há possibilidade de reverter depois. Mitigamos com autenticação de dois fatores robusta, tokens com expiração curta (15 minutos), e validação baseada no dispositivo.

Segundo, DoS: alguém escreve um script e envia 10 mil requisições por segundo. O servidor fica lento, usuários legítimos não conseguem fazer transações. Bloqueamos com rate limiting — AWS WAF para as bordas, circuit breaker no código, auto-scaling automático.

Há uma distinção importante aqui: ferramentas de SAST encontram bugs no código. Threat modeling encontra problemas na arquitetura. Um scanner pode achar uma SQL injection perdida no código. Mas nunca vai detectar que você desenhou o fluxo de autorização de forma que um usuário consegue acessar a conta de outro. Isso só aparece em threat modeling.

Por isso corrigir na fase de design é muito mais econômico. Se você descobre em produção que o fluxo está quebrado, precisa parar o sistema, fazer rollback, investigar quem foi afetado, notificar compliance, avisar clientes. Isso facilmente ultrapassa R$ 500 mil em impacto financeiro e reputacional.

---

## SLIDE 3: O Pipeline — Código até Produção

Aqui mostramos os quatro guardrails que cada commit passa:

Primeiro, CÓDIGO: Lint e Secret Scan. Procuramos por coisas óbvias — credenciais hardcoded no repositório, padrões ruins de código, dependências conhecidas como vulneráveis.

Segundo, BUILD: SAST e SCA. Aqui entra SonarQube (análise estática de código), npm audit (verificação de vulnerabilidades conhecidas), Trivy (scanning de imagem Docker). Perguntamos: esse código tem vulnerabilidade documentada?

Terceiro, REGISTRY: Container Security. A imagem Docker passa por scanning novamente antes de ser enviada ao registro. Não deixamos uma imagem com vulnerabilidade crítica chegar ao ECR.

Quarto, CLOUD: DAST. Agora a imagem está em staging, rodando de verdade. Enviamos OWASP ZAP para atacar a API simulando um atacante real — tentando SQL injection, XSS, autenticação fraca.

A conclusão é importante: nenhuma camada sozinha cobre todas as ameaças. O pipeline automatiza a proteção e garante que o código só avança se tiver passado por todos esses controles.

---

## SLIDE 4: PCI DSS 4.0 — Open Source vs Comercial

Essa é a decisão financeira mais importante do projeto.

Conformidade PCI DSS é mandatória para PIX. Não é opcional. E ao se preparar para auditoria, precisa provar que tem ferramentas de segurança. Aqui vem um equívoco comum:

"Ferramentas comerciais são caras, mas me passam na auditoria mais fácil."

Na verdade não. O que auditor quer é rastreabilidade. Se você usou SonarQube Community (open source) e documentou completamente, passa. Se usou uma ferramenta comercial cara mas não documentou o processo, não passa.

Open source oferece auditoria em código aberto. Você explica para auditor exatamente como funciona, porque o código está acessível. Ferramentas comerciais oferecem suporte de fornecedor, mas isso não é requisito para PCI DSS.

O trade-off é real. Open source é mais barato, mais auditável, tem comunidade forte, mas você precisa de competência operacional. Comercial é mais caro, oferece menos transparência, oferece suporte premium, reduz burn-out do time.

Escolhemos 80% open source porque uma fintech com 40 desenvolvedores não tem orçamento de 200 mil reais por ano em ferramentas de segurança. E porque open source é auditável. É direto.

---

## SLIDE 5: SLAs por Severidade — Porque Prioridade Importa

Aqui definimos: quando encontram um bug crítico, quanto tempo você tem para corrigir?

CRITICAL (24 Horas): Você precisa corrigir ou fazer rollback imediato no Kubernetes. Exemplo: Remote Code Execution na API PIX.
- Significa uma vulnerabilidade que permite alguém executar código arbitrário no servidor.
- Ação: rollback imediato ou patch de emergência em menos de 4 horas.

HIGH (7 Dias): Priorização mandatória na sprint atual. Exemplo: autenticação que pode ser burlada com múltiplos passos.
- É possível, mas requer 5 ações específicas.
- Ação: entra na sprint atual, começa segunda-feira.

MEDIUM (30 Dias): Inclusão no backlog da próxima sprint. Exemplo: XSS em um campo que poucos usuários usam.
- É uma falha, mas risco moderado.
- Ação: backlog, resolve quando houver espaço.

LOW (90 Dias): Backlog técnico ou documentação de risco aceito. Exemplo: um typo em comentário.
- Ação: tech debt, resolve depois.

O ponto que muitos ignoram: métricas só funcionam com visibilidade. Se você não conseguir medir quanto tempo leva entre "encontramos uma vulnerabilidade" e "vulnerability is fixed in production", não tem compliance real. PCI DSS exige isso. Por isso colocamos tudo em dashboard do Jira — executivos conseguem ver em tempo real.

---

## SLIDE 6: Segurança Centralizada vs Distribuída

Momento crítico de decisão organizacional.

MODELO CENTRALIZADO (marcado com X):
"GARGALO. Um time isolado versus dez squads. Segurança vira o time que sempre diz não."

Você tem uma pessoa ou um time de segurança. Dez squads tentando fazer deploy. Todo deploy precisa de aprovação deles. O que acontece?
- Fila de espera cresce
- Desenvolvedores ficam frustrados
- Segurança vira percebida como obstáculo
- Pessoas encontram maneiras de contornar os processos

MODELO HUB & SPOKE (marcado com check):
"ESCALA. Um Security Champion por squad. Segurança distribuída sem travar releases."

Cada squad tem um desenvolvedor treinado em segurança. Não é full-time de segurança — é um desenvolvedor que entende OWASP Top 10 e consegue fazer revisão de código com perspectiva de segurança. Aprovações ficam mais rápidas porque o champion já está dentro do squad.

E há uma insight importante: "O Champion não é o responsável final. É o facilitador de design review e triage autônomo, com o Tech Lead atuando como sponsor."

Ele não é autoridade absoluta. É facilitador. Ele diz "isso aqui tem risco, vamos pensar diferente?" e o tech lead valida junto. Não criamos novo bottleneck. Distribuímos conhecimento.

---

## SLIDE 7: O Roadmap de Maturidade — L1 até L3

MÊS 1 (L1: Base ad-hoc):
"Setup do pipeline básico (Lint + SCA) e identificação dos Champions voluntários."
- SonarQube rodando
- npm audit integrado
- Escolhe cinco champions
- Longe de perfeito, mas com visibilidade inicial

MÊS 2-3 (L2: Ferramentas Ativas):
"Integração SAST + Secret Scan. Gate configurado (bloqueio em Critical). Treinamento OWASP Top 10 para Champions."
- SAST bloqueia merge de código ruim
- Secret scanning apanha credenciais antes do commit
- Champions passam por workshop
- Visibilidade real estabelecida

MÊS 4-6 (L3: Automação Total):
"DAST ativo no K8s. Geração de SBOM para auditoria PCI. Champions realizam triage autônomo com suporte de SLAs em dashboard corporativo."
- DAST testando API de verdade
- Relatórios de conformidade gerados automaticamente
- Champions resolvem problemas autonomamente
- PCI DSS mapeado em 80%

A transição é de respostas ad-hoc para pipelines que barram vulnerabilidades críticas automaticamente antes da produção.

---

## SLIDE 8: O Cofre Dinâmico — Go-To-Market Seguro

Na conclusão, resumimos em três pilares:

PRIMEIRO, TECNOLOGIA:
"Pipeline Enterprise DevSecOps. Proteção automatizada ponta-a-ponta, do Node.js à infraestrutura AWS."
- Tudo integrado
- Do commit até produção passa por escaneamento automatizado

SEGUNDO, PROCESSOS:
"Conformidade PCI DSS 4.0. SLA crítico de 24 horas suportado por ferramentas especializadas de alta precisão."
- Não é opinião
- Tem SLA, tem métrica, tem evidência
- Auditor consegue rastrear tudo

TERCEIRO, PESSOAS:
"Escala Hub & Spoke. Um Security Champion inserido em cada squad garantindo que desenvolvimento nunca pare."
- Não é outsource de segurança
- Cada squad tem seu champion
- Conhecimento distribuído

A última frase é o pedido de aprovação: "Iniciar rollout do projeto piloto hoje garante a conformidade regulatória plena da API PIX em exatamente 6 meses."

Significa: começar segunda-feira, em 6 meses o PIX está blindado. Se esperar, risco cresce, janela regulatória fica apertada, conformidade vira problema.

---

## FECHAMENTO

Toda indústria fala em "shift-left" em segurança. "Desenvolvedores precisam pensar em segurança no design."

É verdade. Mas como fazer isso com 40 desenvolvedores em 5 squads se ninguém foi treinado, não tem ferramenta, não tem tempo?

A resposta: estruturar em L1 até L3. Começar com o básico (SAST), provar que funciona, treinar pessoas, depois aumentar sofisticação (threat modeling, DAST). Incrementalismo estruturado.

O que apresentamos aqui não é teórico. É o que está funcionando em fintechs sérias. Copiamos de startups que cresceram de zero para unicórnio sem sofrer ataques críticos no processo.

Então o convite é este: em 6 meses, a API PIX de vocês está na nuvem, segura, e auditável.

Obrigado pela atenção.

