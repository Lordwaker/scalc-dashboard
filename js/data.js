// ═══════════ TASK DATA ═══════════
// All tasks, sprints, milestones, and day metadata for the ServCalc Dev Calendar

const SPRINTS_DATA = [
  { id: 0, number: 0, title: 'Ambiente de Homologação + Segurança Crítica', period: '26/07 (Sáb) → 29/07 (Ter) · Nenhum deploy em produção antes de concluir', colorClass: 's0', collapsed: false, maxPriority: true, priorityNote: 'O ambiente de homologação protege seus clientes de bugs introduzidos durante o desenvolvimento das melhorias.' },
  { id: 1, number: 1, title: '🚨 Bugs Críticos + Banco + Legislações', period: '30/07 (Qua) → 10/08 (Dom) · Todo deploy passa por homolog primeiro', colorClass: 's1', collapsed: false },
  { id: 2, number: 2, title: '🔧 Refatoração Técnica + Auditoria', period: '11/08 (Seg) → 24/08 (Dom)', colorClass: 's2', collapsed: true },
  { id: 3, number: 3, title: '✨ Polimento e Features Avançadas', period: '25/08 (Seg) → 12/09 (Sex)', colorClass: 's3', collapsed: true },
  { id: 4, number: 4, title: '💰 Redução de Custos Oracle Cloud', period: '15/09 (Seg) → 25/09 (Sex) · Fatura Oracle disparou — ação imediata', colorClass: 's4', collapsed: false, maxPriority: true, priorityNote: 'O saldo Always Free de compute (3.000 OCPU-horas/mês) se esgota antes do fim do mês com 7 OCPUs A1 ligados 24/7, e a Container Instance de produção não tem cota gratuita nenhuma. Cada dia sem ação é dinheiro pago desnecessariamente — plano completo em <code>Documentações/plano_reducao_custos_oci.md</code>.' },
  { id: 5, number: 5, title: '🎓 Tutorial Visual em Todas as Telas', period: '26/10 (Seg) → 06/11 (Sex) · Em andamento — 1.0.5-hmg em homologação desde 04/11 (só frontend)', colorClass: 's5', collapsed: false, highPriority: true, priorityNote: 'Hoje só o Dashboard tem tour guiado (react-joyride em <code>Dashboard.jsx</code>). As dúvidas que os clientes trazem são operacionais e se repetem — um tour por tela, com exemplos, responde antes de virar chamado (base das perguntas: <code>Documentações/faq_atendimento_cliente.md</code>). Padrão visual = tour de primeiro acesso: cores #251d65 / #f0c740, botões em pt-BR, “Pular Tour”, abre sozinho na 1ª visita de cada tela e sempre pelo botão “Entender esta tela”.' }
];

const TASKS_DATA = [
  // ═══ SPRINT 0 — HOMOLOGAÇÃO + SEGURANÇA ═══
  // Sáb 26/07
  { id: 's0-01', sprint: 0, date: '2026-07-26', text: 'Remover CPF e dados sensíveis do texto dos embeddings em <code>iaMemoryService.js</code> — violação LGPD ativa', tags: ['seguranca'], hours: '30min' },
  { id: 's0-02', sprint: 0, date: '2026-07-26', text: 'Remover <code>console.log</code> que imprime token de reset completo em produção (<code>authController.js</code> linha 367)', tags: ['seguranca'], hours: '5min' },
  { id: 's0-03', sprint: 0, date: '2026-07-26', text: 'Atualizar Dockerfile: <code>node:18-alpine</code> → <code>node:22-alpine</code> (Node 18 sem patches de segurança desde Abr/2025)', tags: ['seguranca', 'tecnico'], hours: '1h' },
  { id: 's0-04', sprint: 0, date: '2026-07-26', text: 'Rate limiting no <code>/forgot-password</code> — máx 5 tentativas/15min por IP', tags: ['seguranca'], hours: '1h' },
  { id: 's0-05', sprint: 0, date: '2026-07-26', text: 'Token de reset de senha: salvar hash SHA-256 no banco em vez do token bruto', tags: ['seguranca'], hours: '1.5h' },
  // Dom 27/07
  { id: 's0-06', sprint: 0, date: '2026-07-27', text: '<strong>[EU]</strong> Criar <code>deploy_homolog.py</code> — script que faz build + SSH copy para VM A1', tags: ['homolog', 'tecnico'], hours: '2h', responsible: 'eu' },
  { id: 's0-07', sprint: 0, date: '2026-07-27', text: '<strong>[EU]</strong> Criar script bash de setup da VM A1 — instala Node 22, Nginx, PM2', tags: ['homolog'], hours: '1.5h', responsible: 'eu' },
  { id: 's0-08', sprint: 0, date: '2026-07-27', text: '<strong>[EU]</strong> Criar <code>.env.homolog.example</code> com todas as vars de referência', tags: ['homolog'], hours: '30min', responsible: 'eu' },
  { id: 's0-09', sprint: 0, date: '2026-07-27', text: '<strong>[VOCÊ — OCI]</strong> Criar VM ARM A1 Always Free: Ubuntu 24.04, 2 OCPU, 12GB RAM', tags: ['homolog'], hours: '30min', responsible: 'voce' },
  { id: 's0-10', sprint: 0, date: '2026-07-27', text: '<strong>[VOCÊ — DB]</strong> Criar banco <code>scalc_homolog</code> no PostgreSQL + rodar schema.sql', tags: ['homolog', 'banco'], hours: '30min', responsible: 'voce' },
  { id: 's0-11', sprint: 0, date: '2026-07-27', text: '<strong>[VOCÊ — Cloudflare]</strong> DNS <code>homolog.servcalc.com.br</code> → IP da VM A1', tags: ['homolog'], hours: '15min', responsible: 'voce' },
  // Seg 28/07
  { id: 's0-12', sprint: 0, date: '2026-07-28', text: 'Executar script de setup na VM A1 via SSH — instalar Node 22, PM2, Nginx', tags: ['homolog', 'tecnico'], hours: '1h' },
  { id: 's0-13', sprint: 0, date: '2026-07-28', text: 'Configurar <code>.env.homolog</code> na VM A1 com variáveis do banco de homolog', tags: ['homolog', 'tecnico'], hours: '30min' },
  { id: 's0-14', sprint: 0, date: '2026-07-28', text: 'Executar <code>python deploy_homolog.py 0.1.0-homolog</code> — primeiro deploy do backend', tags: ['homolog', 'tecnico'], hours: '1h' },
  { id: 's0-15', sprint: 0, date: '2026-07-28', text: 'Configurar Nginx na VM A1 para servir frontend e proxy API Node porta 3001', tags: ['homolog', 'tecnico'], hours: '1h' },
  { id: 's0-16', sprint: 0, date: '2026-07-28', text: 'Testar <code>homolog.servcalc.com.br</code>: login, dashboard, health check — ponta a ponta', tags: ['homolog', 'tecnico'], hours: '1h' },
  { id: 's0-17', sprint: 0, date: '2026-07-28', text: 'Documentar fluxo de deploy: <em>branch homolog → testar → merge main → produção</em>', tags: ['homolog', 'tecnico'], hours: '30min' },
  // Ter 29/07
  { id: 's0-18', sprint: 0, date: '2026-07-29', text: 'CORS via variável de ambiente <code>CORS_ORIGINS</code> — evitar hardcode', tags: ['seguranca', 'tecnico'], hours: '30min' },
  { id: 's0-19', sprint: 0, date: '2026-07-29', text: 'Adicionar <code>HEALTHCHECK</code> no Dockerfile — detecta container travado', tags: ['tecnico'], hours: '20min' },
  { id: 's0-20', sprint: 0, date: '2026-07-29', text: 'Validar que deploy segurança vai primeiro para homolog, testa, depois produção', tags: ['homolog', 'tecnico'], hours: '1h' },
  { id: 's0-21', sprint: 0, date: '2026-07-29', text: 'Deploy das correções de segurança em <strong>produção</strong> após validação em homolog', tags: ['seguranca', 'homolog'], hours: '1h' },
  { id: 's0-22', sprint: 0, date: '2026-07-29', text: 'Criar índices faltantes: <code>calculos(escritorio_id)</code>, <code>vinculos_trabalho(cliente_id)</code>, <code>documentos(cliente_id)</code>', tags: ['banco'], hours: '1h' },
  { id: 's0-23', sprint: 0, date: '2026-07-29', text: 'Configurar backup diário do PostgreSQL → OCI Object Storage (script cron)', tags: ['tecnico'], hours: '2h' },

  // ═══ SPRINT 1 — BUGS + BANCO + LEGISLAÇÕES ═══
  // Qua 30/07
  { id: 's1-01', sprint: 1, date: '2026-07-30', text: 'Reproduzir e diagnosticar bug "não consigo fazer nenhum cálculo de RGPS" (reportado Regeane 01/07)', tags: ['bug', 'feedback'], hours: '2h' },
  { id: 's1-02', sprint: 1, date: '2026-07-30', text: 'Corrigir lógica de cálculo RGPS + testes com múltiplos cenários em homolog', tags: ['bug'], hours: '3h' },
  { id: 's1-03', sprint: 1, date: '2026-07-30', text: 'Atualizar tabela de <strong>idade mínima</strong> para RGPS — requisito faltando', tags: ['bug', 'feedback'], hours: '1h' },
  // Qui 31/07
  { id: 's1-04', sprint: 1, date: '2026-07-31', text: 'Investigar e corrigir bug do cálculo de <strong>integralidade e paridade</strong> — saía valor aleatório', tags: ['bug', 'feedback'], hours: '3h' },
  { id: 's1-05', sprint: 1, date: '2026-07-31', text: 'Corrigir INSS: <strong>pensão por morte não deve ser computada</strong> como tempo de contribuição', tags: ['bug', 'feedback'], hours: '2h' },
  { id: 's1-06', sprint: 1, date: '2026-07-31', text: 'Sinalizador visual para benefícios importados pelo CNIS: auxílio-acidente, salário-maternidade, BPC', tags: ['feedback'], hours: '1h' },
  // Sex 01/08
  { id: 's1-07', sprint: 1, date: '2026-08-01', text: '<strong>[VOCÊ — DB]</strong> Fix UNIQUE CPF global → trocar para <code>UNIQUE(cpf, escritorio_id)</code> com migration segura', tags: ['banco'], hours: '2h' },
  { id: 's1-08', sprint: 1, date: '2026-08-01', text: '<strong>[VOCÊ — DB]</strong> Adicionar coluna <code>updated_at</code> + triggers em calculos, clientes_calculo, vinculos_trabalho', tags: ['banco'], hours: '1h' },
  { id: 's1-09', sprint: 1, date: '2026-08-01', text: 'Cadastrar e vincular <strong>LC 133/2021 (Curitiba/PR)</strong> ao município', tags: ['feedback'], hours: '1.5h' },
  { id: 's1-10', sprint: 1, date: '2026-08-01', text: 'Cadastrar legislação <strong>Jacareí/SP</strong> e validar cálculo', tags: ['feedback'], hours: '1h' },
  { id: 's1-11', sprint: 1, date: '2026-08-01', text: 'Deploy dos fixes de RGPS + integralidade em homolog → validar → deploy produção', tags: ['homolog', 'bug'], hours: '1h' },
  // Sáb 02/08
  { id: 's1-12', sprint: 1, date: '2026-08-02', text: '<strong>Botão excluir ficha funcional</strong> — desanexar e reanexar documento sem refazer processo', tags: ['feedback'], hours: '2h' },
  { id: 's1-13', sprint: 1, date: '2026-08-02', text: 'Cache em memória (TTL 60s) no <code>authMiddleware</code> — elimina query de plano a cada request', tags: ['tecnico'], hours: '2h' },
  // Dom 03/08
  { id: 's1-14', sprint: 1, date: '2026-08-03', text: 'Corrigir embeddings duplicados do Jaden: implementar UPSERT por <code>(escritorio_id, source_type, source_id)</code>', tags: ['tecnico'], hours: '1.5h' },
  { id: 's1-15', sprint: 1, date: '2026-08-03', text: '<strong>Ficha Funcional — identificar períodos averbados</strong>: melhorar prompt da IA e parser', tags: ['feedback'], hours: '2.5h' },
  // Seg 04/08
  { id: 's1-16', sprint: 1, date: '2026-08-04', text: 'Levantar situações que desqualificam magistério: cargo em comissão, cedência, lotação em núcleo', tags: ['feedback'], hours: '1h' },
  { id: 's1-17', sprint: 1, date: '2026-08-04', text: 'Modelar campo <strong>"lotação"</strong> no vínculo de trabalho — backend (coluna DB) + frontend (wizard)', tags: ['feedback', 'banco'], hours: '3h' },
  { id: 's1-18', sprint: 1, date: '2026-08-04', text: 'Implementar regra: se <code>lotação ∈ {núcleo, cedido, cargo em comissão}</code> → não conta magistério', tags: ['feedback'], hours: '2h' },
  // Ter 05/08
  { id: 's1-19', sprint: 1, date: '2026-08-05', text: 'Integrar análise de lotação ao wizard RPPS + exibir alerta quando período excluído', tags: ['feedback'], hours: '2h' },
  { id: 's1-20', sprint: 1, date: '2026-08-05', text: '<strong>Redesign lançamento manual de remuneração</strong>: tabela interativa com competência + valor, Tab entre campos', tags: ['feedback'], hours: '4h' },
  // Qua 06/08
  { id: 's1-21', sprint: 1, date: '2026-08-06', text: 'Backend: endpoint batch para salvar múltiplos lançamentos de remuneração de uma só vez', tags: ['feedback'], hours: '2h' },
  { id: 's1-22', sprint: 1, date: '2026-08-06', text: '<strong>Formatação automática monetária</strong>: ao digitar, formatar como R$ (<code>1500</code> → <code>R$ 1.500,00</code>)', tags: ['feedback'], hours: '2h' },
  { id: 's1-23', sprint: 1, date: '2026-08-06', text: '<strong>Preenchimento automático no wizard de integralidade/paridade</strong>: valores progressivos', tags: ['feedback'], hours: '2h' },
  // Qui 07/08
  { id: 's1-24', sprint: 1, date: '2026-08-07', text: 'Mapear todos os problemas nos relatórios PDF: layout, dados incorretos, formatação, ordenação', tags: ['feedback'], hours: '2h' },
  { id: 's1-25', sprint: 1, date: '2026-08-07', text: 'Corrigir estrutura base do PDF: margens, cabeçalho, rodapé, logo, tipografia', tags: ['feedback', 'bug'], hours: '2h' },
  { id: 's1-26', sprint: 1, date: '2026-08-07', text: 'Corrigir seções do PDF: dados do cliente, histórico de remunerações, vínculos, resultado', tags: ['feedback', 'bug'], hours: '2h' },
  // Sex 08/08
  { id: 's1-27', sprint: 1, date: '2026-08-08', text: 'Melhorar tela admin de municípios: busca por nome, filtro por UF, edição inline de legislação', tags: ['feedback'], hours: '3h' },
  { id: 's1-28', sprint: 1, date: '2026-08-08', text: 'Cadastrar legislações pendentes da fila (municípios sem regra cadastrada)', tags: ['feedback'], hours: '2h' },
  { id: 's1-29', sprint: 1, date: '2026-08-08', text: 'Testes finais em homolog de todas as features Sprint 1 → Deploy em produção', tags: ['homolog', 'bug'], hours: '1h' },
  // Sáb-Dom 09-10/08
  { id: 's1-30', sprint: 1, date: '2026-08-09', text: 'Ferramenta de <strong>importação em lote de municípios</strong> via CSV no painel admin', tags: ['feedback'], hours: '4h' },
  { id: 's1-31', sprint: 1, date: '2026-08-09', text: 'Testes regressivos completos + documentar Sprint 1 + comunicar usuários sobre melhorias', tags: ['bug'], hours: '4h' },

  // ═══ SPRINT 2 — REFATORAÇÃO TÉCNICA ═══
  // Seg 11/08
  { id: 's2-01', sprint: 2, date: '2026-08-11', text: 'Criar tabela <code>audit_log</code> para rastrear alterações em cálculos (quem, quando, o quê)', tags: ['banco'], hours: '2h' },
  { id: 's2-02', sprint: 2, date: '2026-08-11', text: 'Revisar e corrigir contadores de relatório mensais em <code>escritorios</code> — bug no reset mensal', tags: ['bug', 'banco'], hours: '2h' },
  { id: 's2-03', sprint: 2, date: '2026-08-11', text: 'Melhorar tela admin de gestão de legislações: vincular lei a município, editar parâmetros', tags: ['tecnico'], hours: '2h' },
  // Ter-Qua 12-13/08
  { id: 's2-04', sprint: 2, date: '2026-08-12', text: 'Extrair lógica RPPS → <code>rppsController.js</code> (73KB viram módulos menores)', tags: ['tecnico'], hours: '6h' },
  { id: 's2-05', sprint: 2, date: '2026-08-12', text: 'Extrair RGPS, Integralidade, Sentença em controllers próprios + <code>index.js</code> re-exportando', tags: ['tecnico'], hours: '6h' },
  // Qui-Sex 14-15/08
  { id: 's2-06', sprint: 2, date: '2026-08-14', text: 'Criar <code>ClienteRepository.js</code>, <code>CalculoRepository.js</code>, <code>EscritorioRepository.js</code> — centralizar SQL', tags: ['tecnico'], hours: '6h' },
  { id: 's2-07', sprint: 2, date: '2026-08-14', text: 'Testes de regressão completos do refactor em homolog — todos os cálculos funcionando', tags: ['bug'], hours: '4h' },
  { id: 's2-08', sprint: 2, date: '2026-08-14', text: 'Implementar Refresh Token — access token 15min + refresh 7 dias com rotação', tags: ['seguranca', 'tecnico'], hours: '4h' },
  // Sáb-Dom 16-17/08
  { id: 's2-09', sprint: 2, date: '2026-08-16', text: 'Avaliar e configurar migração build Vite → OCI Object Storage + Cloudflare CDN', tags: ['tecnico'], hours: '4h' },
  { id: 's2-10', sprint: 2, date: '2026-08-16', text: 'Deploy Sprint 2 em produção após validação em homolog + monitoramento de logs', tags: ['homolog', 'bug', 'tecnico'], hours: '2h' },
  // Seg-Sex 18-22/08
  { id: 's2-11', sprint: 2, date: '2026-08-18', text: 'Migrar controllers restantes para usar Repository Layer', tags: ['tecnico'], hours: '8h' },
  { id: 's2-12', sprint: 2, date: '2026-08-18', text: 'Documentar nova arquitetura de módulos + retrospectiva + planning Sprint 3', tags: ['tecnico'], hours: '4h' },

  // ═══ SPRINT 3 — POLIMENTO ═══
  { id: 's3-01', sprint: 3, date: '2026-08-25', text: 'Sprint 3 será detalhado ao final do Sprint 2', tags: [], hours: '' },

  // ═══ SPRINT 4 — REDUÇÃO DE CUSTOS ORACLE CLOUD (PRIORIDADE MÁXIMA) ═══
  // Fase 1 — ganhos imediatos, risco baixo (~R$24/mês) — Seg 15/09
  { id: 's4-01', sprint: 4, date: '2026-09-15', text: '<strong>[VOCÊ — OCI]</strong> Excluir as VMs paradas <code>deploy-runner</code> e <code>scalc-apresentation-page-backend-server</code> + seus boot volumes (confirmar antes se <code>deploy-runner</code> ainda é usado por algum pipeline)', tags: ['custo'], hours: '20min', responsible: 'voce' },
  { id: 's4-02', sprint: 4, date: '2026-09-15', text: '<strong>[VOCÊ — OCI]</strong> Excluir custom images não utilizadas (4 imagens, 22GB) após confirmar que nenhuma VM depende delas', tags: ['custo'], hours: '15min', responsible: 'voce' },
  { id: 's4-03', sprint: 4, date: '2026-09-15', text: '<strong>[VOCÊ — OCI]</strong> Reduzir o budget <code>Alto_Consumo</code> de R$180 para R$80/mês e criar alertas em 50% / 80% / 100% (real e previsto)', tags: ['custo'], hours: '15min', responsible: 'voce' },
  { id: 's4-04', sprint: 4, date: '2026-09-15', text: '<strong>[VOCÊ — OCI]</strong> Ativar o Cost Anomaly Detection na tenancy', tags: ['custo'], hours: '10min', responsible: 'voce' },

  // Fase 2 — voltar o A1 para dentro do gratuito (~R$110/mês) — Ter 16/09 a Sex 19/09
  { id: 's4-05', sprint: 4, date: '2026-09-16', text: '<strong>[VOCÊ — OCI]</strong> Reduzir <code>servcalc-homolog</code> de 2 → 1 OCPU (o próprio Cloud Advisor já recomenda essa redução)', tags: ['custo'], hours: '30min', responsible: 'voce' },
  { id: 's4-06', sprint: 4, date: '2026-09-16', text: '<strong>[VOCÊ — OCI]</strong> Configurar OCI Resource Scheduler para desligar <code>servcalc-homolog</code> às 20h e religar às 8h em dias úteis', tags: ['custo'], hours: '1h', responsible: 'voce' },
  { id: 's4-07', sprint: 4, date: '2026-09-17', text: '<strong>[VOCÊ — OCI]</strong> Reduzir <code>Apresentação Servcalc</code> de 2 → 1 OCPU, ou desligar quando não houver demonstração agendada', tags: ['custo'], hours: '30min', responsible: 'voce' },
  { id: 's4-08', sprint: 4, date: '2026-09-17', text: '<strong>[VOCÊ — OCI]</strong> Reduzir <code>servcalc-frontend</code> de 2 → 1 OCPU (medir CPU antes de aplicar)', tags: ['custo'], hours: '30min', responsible: 'voce' },
  { id: 's4-09', sprint: 4, date: '2026-09-18', text: 'Confirmar que a RAM A1 total ligada ficou ≤ 24GB (limite Always Free) após os downsizes acima', tags: ['custo'], hours: '15min', responsible: 'voce' },
  { id: 's4-10', sprint: 4, date: '2026-09-19', text: 'Conferir no Cost Analysis (Daily, agrupado por Service) se a linha <em>Compute</em> voltou para R$0,00/dia', tags: ['custo'], hours: '15min', responsible: 'voce' },

  // Fase 3 — eliminar a Container Instance (~R$121/mês, maior ganho isolado) — Seg 22/09 a Qua 24/09
  { id: 's4-11', sprint: 4, date: '2026-09-22', text: '<strong>[EU]</strong> Adaptar <code>deploy.py</code>: trocar <code>docker build</code> + recriação de Container Instance por deploy via SSH + PM2 (mesmo padrão já usado em <code>deploy_homolog.py</code>)', tags: ['custo', 'tecnico'], hours: '4h', responsible: 'eu' },
  { id: 's4-12', sprint: 4, date: '2026-09-22', text: '<strong>[VOCÊ — OCI]</strong> Provisionar (ou reaproveitar) uma VM A1 dedicada ao backend de produção com Node 22, PM2 e Nginx — mesmo setup já usado em homolog', tags: ['custo'], hours: '1h', responsible: 'voce' },
  { id: 's4-13', sprint: 4, date: '2026-09-23', text: 'Validar o novo fluxo de deploy do backend em VM A1 primeiro em homologação, comparando resultado com a Container Instance atual', tags: ['custo', 'homolog'], hours: '2h' },
  { id: 's4-14', sprint: 4, date: '2026-09-24', text: '<strong>[VOCÊ — OCI]</strong> Após validação em homolog, migrar produção da Container Instance para a VM A1 e excluir <code>scalc-backend-instance</code>', tags: ['custo'], hours: '1h', responsible: 'voce' },

  // Fase 4 — governança permanente — junto com a Fase 3
  { id: 's4-15', sprint: 4, date: '2026-09-24', text: '<strong>[VOCÊ — OCI]</strong> Criar quota policy limitando <code>standard-a1-core-count</code> a 4 e <code>container-instance-count</code> a 0 no compartimento root', tags: ['custo'], hours: '30min', responsible: 'voce' },
  { id: 's4-16', sprint: 4, date: '2026-09-25', text: 'Atualizar <code>fluxo_deploy.md</code> com a regra: nenhuma VM nova sem checar o saldo de OCPU-horas do mês', tags: ['custo', 'tecnico'], hours: '20min', responsible: 'eu' },
  { id: 's4-17', sprint: 4, date: '2026-09-25', text: '<strong>[VOCÊ]</strong> Confirmar com o suporte Oracle o teor do aviso "Always Free A1 Resource Limit Update" e o saldo A1 vigente', tags: ['custo'], hours: '30min', responsible: 'voce' },

  // ═══ SPRINT 5 — TUTORIAL VISUAL EM TODAS AS TELAS (ALTA PRIORIDADE) ═══
  // Personagens de exemplo usados em TODOS os tours (fictícios, nunca salvos no banco):
  //   Maria Aparecida Souza — 12/03/1968, F, professora municipal de Curitiba desde 01/02/1995 (RPPS)
  //   João Pereira Lima    — 05/07/1970, M, CNIS com 3 vínculos privados (RGPS)
  // Fundação — Seg 26/10
  { id: 's5-01', sprint: 5, date: '2026-10-26', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · <strong>[EU]</strong> Extrair o tour do <code>Dashboard.jsx</code> para um componente reutilizável <code>components/TourPagina.jsx</code> + hook <code>useTourPagina(chave, passos)</code>: mesmo estilo/locale do tour de primeiro acesso, chave por tela (<code>@servcalc:tour_visto:clientes-cadastrar</code>), abre na 1ª visita e reabre pelo botão <em>“Entender esta tela”</em> padronizado no cabeçalho de cada página', tags: ['tutorial'], hours: '4h', responsible: 'eu' },
  { id: 's5-02', sprint: 5, date: '2026-10-26', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · <strong>[EU]</strong> Alvos estáveis: trocar <code>className="tour-*"</code> por <code>data-tour="..."</code> (não quebra com styled-components) e suportar tours <strong>por passo</strong> nos assistentes (RGPS/RPPS/Sentença) — o tour do Passo 3 só roda quando o Passo 3 está na tela. Ex: chave <code>rpps:passo3</code>', tags: ['tutorial'], hours: '2h', responsible: 'eu' },
  // Fundação — Ter 27/10
  { id: 's5-03', sprint: 5, date: '2026-10-27', text: '<strong>[EU]</strong> Guardar “tours já vistos” <strong>por usuário no banco</strong> (coluna <code>usuarios_app.tours_vistos JSONB</code> + <code>PUT /usuarios/tours</code>), não só no localStorage — hoje o tour reaparece em cada navegador/computador novo. Migration via homolog primeiro — <em>nesta entrega ficou no localStorage por usuário (chave inclui o id); a coluna no banco segue pendente</em>', tags: ['tutorial'], hours: '3h', responsible: 'eu' },
  { id: 's5-04', sprint: 5, date: '2026-10-27', text: '<strong>[EU]</strong> <strong>Central de Tutoriais</strong>: ícone “?” no topo (ao lado do 🎉) listando todos os tours com status visto/não visto + “Rever todos”. Ex: “Cadastrar Cliente · 6 passos · ✔ visto”', tags: ['tutorial'], hours: '3h', responsible: 'eu' },
  // Telas de cliente — Qua 28/10
  { id: 's5-05', sprint: 5, date: '2026-10-28', text: 'Tour <strong>Dashboard</strong> (revisão do existente): incluir passos para 🎉 Novidades, troca de tema e menu do usuário (Perfil / Escritório / Assinatura / Configurações / Sair) e apontar para a nova Central de Tutoriais', tags: ['tutorial'], hours: '1h' },
  { id: 's5-06', sprint: 5, date: '2026-10-28', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Cadastrar Cliente</strong>: ① só Nome, Nascimento e Gênero são obrigatórios — <em>Ex: Maria Aparecida Souza, 12/03/1968, Feminino</em> ② CPF/e-mail/telefone podem vir depois ③ PCD + grau — <em>Ex: moderada → exige 24 anos de contribuição (mulher)</em> ④ vínculo público opcional — <em>Ex: Prefeitura de Curitiba · Professora · ingresso 01/02/1995</em> ⑤ marcar “professor(a) da educação básica” / “atividade de risco” ⑥ Cadastrar', tags: ['tutorial'], hours: '1.5h' },
  { id: 's5-07', sprint: 5, date: '2026-10-28', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Gerenciar Clientes + Editar Cliente</strong>: busca por nome ou CPF (<em>Ex: “Maria” ou “123.456”</em>), ícones Calcular / Editar / Excluir — destacar que <strong>excluir apaga todos os cálculos do cliente</strong>; na edição, “Salvar Dados Pessoais” é separado da grade de vínculos', tags: ['tutorial'], hours: '1.5h' },
  { id: 's5-08', sprint: 5, date: '2026-10-28', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Grade de Vínculos</strong>: “Novo Período” — <em>Ex: Banco do Brasil · Escriturário · 03/1988 a 12/1994 · Normal</em>; explicar cada coluna (Tipo, Lotação — núcleo/cedido/comissão não contam magistério —, Carência, Averbar, S. Público, Ignorar); disquete fica verde = alteração não salva; ações em lote ao selecionar linhas', tags: ['tutorial'], hours: '2h' },
  // Dados e importações — Qui 29/10
  { id: 's5-09', sprint: 5, date: '2026-10-29', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Histórico de Contribuições</strong>: ① Importar CNIS (PDF, vários de uma vez; OCR automático se o PDF estiver corrompido) ② Importar Ficha → Funcional (vínculos/cargos) × Financeira (salários) ③ Planilha .xls/.xlsx/.csv com conferência do rodapé ④ Manual — <em>Ex: 03/1994 · Cruzeiro Real · CR$ 89.853 → prévia em R$</em> ⑤ Concomitância: Somar × Separar ⑥ filtro por competência + Editar Valor / Excluir Seleção', tags: ['tutorial'], hours: '3h' },
  { id: 's5-10', sprint: 5, date: '2026-10-29', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Ficha Funcional (Gestão de Vida Funcional)</strong>: Averbação Externa soma — <em>Ex: “CTC Prefeitura de Pinhais 2001-2003” · 1.095 dias</em>; Falta/Licença desconta — <em>Ex: “Faltas injustificadas 2018” · 30 dias</em>; editar e excluir eventos', tags: ['tutorial'], hours: '1h' },
  { id: 's5-11', sprint: 5, date: '2026-10-29', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Central de Cálculos + Gerenciar Cálculos</strong>: qual cálculo usar (ⓘ em cada card; “Em Breve” ainda indisponível), busca — <em>Ex: “Maria” ou “Integralidade”</em>; filtro por tipo; Abrir / Duplicar (<em>testar cenário sem mexer no original — consome cota</em>) / Excluir (libera cota)', tags: ['tutorial'], hours: '2h' },
  // Assistentes de cálculo — Sex 30/10
  { id: 's5-12', sprint: 5, date: '2026-10-30', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Cálculo RGPS</strong> (por passo): P1 selecionar <em>João Pereira Lima</em>; P2 ativar/ignorar períodos (<em>Ex: desmarcar o vínculo RPPS</em>), nome “Planejamento INSS 2026”, DER 20/10/2026 — avisar que usa os vínculos já cadastrados (importe o CNIS antes); P3 resultado → abre o Simulador; botão Baixar Relatório', tags: ['tutorial'], hours: '2h' },
  { id: 's5-13', sprint: 5, date: '2026-10-30', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Cálculo RPPS</strong> (por passo): P1 <em>Maria Aparecida Souza</em>; P2 Município → digitar “Curi” → Curitiba, ou regra da biblioteca, ou “Regra Manual”; P3 Importar CNIS, <strong>Cargo Aposentador (alvo)</strong> obrigatório, averbação CTC, parâmetros (<em>Ex: última remuneração R$ 8.450,00 · início carreira 01/02/1995</em>); P4 resultado + Exportar PDF', tags: ['tutorial'], hours: '4h' },
  // Demais cálculos — Ter 03/11 (Seg 02/11 é feriado de Finados)
  { id: 's5-14', sprint: 5, date: '2026-11-03', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Integralidade e Paridade</strong>: cenário SEM (pela média) × COM integralidade — <em>Ex: 60 anos · R$ 5.000,00 × 62 anos · R$ 18.000,00</em>; sobrevida pela Tábua IBGE; leitura da “Diferença Financeira do Planejamento”; Baixar PDF Oficial', tags: ['tutorial'], hours: '1.5h' },
  { id: 's5-15', sprint: 5, date: '2026-11-03', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Cumprimento de Sentença</strong> (por passo): P1 datas + índice (<em>Ex: Tema 810 STF · juros Art. 1º-F · SELIC a partir de 12/2021</em>), honorários sucumbenciais 10%, prescrição quinquenal, limite JEF; P2 Projetar Parcelas — <em>Ex: DIB 01/2020 · RMI R$ 1.412,00 · INPC</em>; tutela antecipada; P3 contratuais 30%; P4 RPV/Precatório', tags: ['tutorial'], hours: '3h' },
  { id: 's5-16', sprint: 5, date: '2026-11-03', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Simulador</strong>: linha do tempo de vínculos (badges Especial x1.4, Averbado, Sem Carência, Projetado), editor do período (coluna “Usar” por mês), Novo Período Projetado — <em>Ex: Prefeitura de Curitiba · 01/2027 → em aberto · RPPS</em>, Mês Projetado — <em>Ex: 02/2027 · R$ 9.000,00</em>, “Calcular Agora” (não consome cota)', tags: ['tutorial'], hours: '2h' },
  // Relatórios e cadastros de apoio — Qua 04/11
  { id: 's5-17', sprint: 5, date: '2026-11-04', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Relatórios de Planejamento</strong>: Rascunho (editável, não consome cota) × Finalizado (congelado, consome 1); buscar cliente com 3+ letras; escolher cenários; Análise do advogado — <em>Ex: “Cliente completa 75 anos em out/2026; protocolar com 90 dias de antecedência”</em>; logo PNG/JPG ≤ 2 MB, ≥ 400 px; Finalizar', tags: ['tutorial'], hours: '2.5h' },
  { id: 's5-18', sprint: 5, date: '2026-11-04', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tour <strong>Regras e Municípios + Nova Regra Personalizada</strong>: região → estado → cidade → regras e link da lei; Criar Regra — <em>Ex: “Regra de Transição Municipal 2022” · Pontos 96/86 · 20 anos públicos · 5 no cargo · média 100% · 60% + 2% · paridade</em>; regra criada no RPPS pode ser salva no escritório ou só no cálculo', tags: ['tutorial'], hours: '2h' },
  { id: 's5-19', sprint: 5, date: '2026-11-04', text: 'Tours curtos: <strong>Biblioteca de Modelos</strong> (baixar petição), <strong>Deixe seu Feedback</strong> (<em>Ex: Sugestão · Legislações/Regras · “Incluir regra de Pinhais/PR”</em>), <strong>Meu Perfil</strong> (troca de senha exige a antiga), <strong>Configurações</strong> (quando usar “Forçar Atualização de Memória” do Jaden)', tags: ['tutorial'], hours: '1.5h' },
  // Telas de administrador + revisão — Qui 05/11
  { id: 's5-20', sprint: 5, date: '2026-11-05', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Tours <strong>só para perfil Administrador</strong>: Escritório e Usuários (Membro × Administrador, senha provisória, reset de senha, usuário inativo continua contando no limite) e Assinatura (mensal × anual, cupom, pagamento em nova aba, Gerenciar: cartão / faturas / cancelar). Não exibir para Membro', tags: ['tutorial'], hours: '2.5h' },
  { id: 's5-21', sprint: 5, date: '2026-11-05', text: '<strong>[EU]</strong> Avaliar botão “Preencher com exemplo” nos formulários durante o tour (só preenche a tela com Maria/João, <strong>não salva</strong> e não consome cota)', tags: ['tutorial'], hours: '2h', responsible: 'eu' },
  { id: 's5-22', sprint: 5, date: '2026-11-05', text: '<strong>[VOCÊ]</strong> Revisar textos e exemplos jurídicos de todos os tours (índices, prazos, requisitos PCD/magistério) antes de ir para homolog', tags: ['tutorial'], hours: '2h', responsible: 'voce' },
  // QA + entrega — Sex 06/11
  { id: 's5-23', sprint: 5, date: '2026-11-06', text: 'QA em homolog: todos os tours em desktop, celular, menu lateral recolhido, tema escuro, perfil Membro × Admin, 1ª visita × “Entender esta tela”; nenhum passo apontando para elemento inexistente', tags: ['tutorial'], hours: '3h' },
  { id: 's5-24', sprint: 5, date: '2026-11-06', text: 'Deploy em produção + nota de versão (“Agora toda tela tem tutorial”) + atualizar seção 11 de <code>Documentações/faq_atendimento_cliente.md</code>', tags: ['tutorial'], hours: '1h' },
  // Achados e extras da execução em homolog — Ter 04/11
  { id: 's5-25', sprint: 5, date: '2026-11-04', text: '✅ <em>no ar em homolog (1.0.5-hmg, 04/11)</em> · Botões <strong>“?”</strong> com explicação e exemplo nos campos técnicos: grade de vínculos, histórico de contribuições, ficha funcional, RGPS, RPPS, Integralidade, Sentença, Simulador e regra personalizada. Textos num arquivo só: <code>frontend/src/tutorial/ajuda.js</code>', tags: ['tutorial'], hours: '3h', responsible: 'eu' },
  { id: 's5-26', sprint: 5, date: '2026-11-04', text: '<strong>Bug — Sentença:</strong> opções que aparecem na tela mas o backend nunca lê: limite de 60 SM (JEF), fixar início da SELIC, mês quebrado, honorários sucumbenciais e tutela antecipada. Também sem ação: “Inserir Parcelas Manualmente”, “Importar HISCRE” e “Gerar Relatório em PDF”. Ficaram sem “?” de propósito até serem implementadas', tags: ['bug'], hours: '6h' },
  { id: 's5-27', sprint: 5, date: '2026-11-04', text: '<strong>Bug — Editar Cliente:</strong> o CPF é obrigatório na edição, mas opcional no cadastro. Cliente cadastrado sem CPF não consegue salvar os dados pessoais depois', tags: ['bug'], hours: '15min' },
  { id: 's5-28', sprint: 5, date: '2026-11-05', text: '<strong>[VOCÊ]</strong> Percorrer os tours em homolog com login real (o Claude não usa senhas): 1ª visita de cada tela, botão “Entender esta tela”, os “?” e o tema escuro', tags: ['tutorial', 'homolog'], hours: '1h', responsible: 'voce' }
];

const MILESTONES_DATA = [
  { date: '26-27/07', text: '🔐 Segurança crítica corrigida + Scripts de homolog criados', done: true },
  { date: '28/07', text: '🏗️ <strong>Ambiente de homologação funcionando</strong>', done: true },
  { date: '29/07', text: '✅ Correções de segurança em produção via homolog', done: true },
  { date: '31/07', text: '🐛 Bugs de RGPS, integralidade e paridade corrigidos', done: true },
  { date: '08/08', text: '🧑‍⚖️ Sprint 1 entregue — features de usuário, PDF e municípios', done: false },
  { date: '22/08', text: '🔧 Sprint 2 entregue — código refatorado e testável', done: false },
  { date: '12/09', text: '✨ Sprint 3 entregue — produto estável e diferenciado', done: false },
  { date: '15/09', text: '💰 Fase 1 concluída — recursos parados excluídos e alertas de custo ativos', done: false },
  { date: '19/09', text: '💰 Fase 2 concluída — A1 de volta a ≤4 OCPUs, dentro do Always Free', done: false },
  { date: '24/09', text: '💰 Fase 3 concluída — backend fora da Container Instance (~R$121/mês economizados)', done: false },
  { date: '25/09', text: '💰 Fase 4 concluída — quota policies travando o saldo A1 permanentemente', done: false },
  { date: '04/11', text: '🎓 Base do tutorial pronta — componente reutilizável, tours por passo e “já visto” por usuário', done: true },
  { date: '04/11', text: '🎓 Telas principais com tour, exemplos e botões “?” — no ar em homologação (1.0.5-hmg)', done: true },
  { date: '06/11', text: '🎓 <strong>Tutorial visual em produção</strong> em todas as telas do ServCalc', done: false }
];

// Day metadata keyed by date string for O(1) lookup
const DAYS_DATA = {
  '2026-07-26': { emoji: '🔐', label: 'Sábado, 26/07', description: 'Segurança crítica (fixes rápidos)', isWeekend: true, weekendHours: '4h' },
  '2026-07-27': { emoji: '🏗️', label: 'Domingo, 27/07', description: 'Eu: scripts homolog | Você: infraestrutura OCI', isWeekend: true, weekendHours: '4h' },
  '2026-07-28': { emoji: '🏗️', label: 'Segunda, 28/07', description: '~6h · Setup e primeiro deploy em homolog', isWeekend: false },
  '2026-07-29': { emoji: '✅', label: 'Terça, 29/07', description: '~6h · Segurança restante + validação homolog', isWeekend: false },
  '2026-07-30': { emoji: '🐛', label: 'Quarta, 30/07', description: '~6h · Bug RGPS + Idade mínima', isWeekend: false },
  '2026-07-31': { emoji: '🐛', label: 'Quinta, 31/07', description: '~6h · Integralidade + INSS pensão', isWeekend: false },
  '2026-08-01': { emoji: '📊', label: 'Sexta, 01/08', description: '~6h · Banco + Legislações', isWeekend: false },
  '2026-08-02': { emoji: '🧑‍⚖️', label: 'Sábado, 02/08', description: 'UX feedback usuários', isWeekend: true, weekendHours: '4h' },
  '2026-08-03': { emoji: '🤖', label: 'Domingo, 03/08', description: 'IA Jaden + Averbações', isWeekend: true, weekendHours: '4h' },
  '2026-08-04': { emoji: '👩‍🏫', label: 'Segunda, 04/08', description: '~6h · Regra Magistério Parte 1', isWeekend: false },
  '2026-08-05': { emoji: '👩‍🏫', label: 'Terça, 05/08', description: '~6h · Magistério Parte 2 + Lançamento Manual', isWeekend: false },
  '2026-08-06': { emoji: '📝', label: 'Quarta, 06/08', description: '~6h · UX + Formatação', isWeekend: false },
  '2026-08-07': { emoji: '📑', label: 'Quinta, 07/08', description: '~6h · PDF Diagnóstico + Correções', isWeekend: false },
  '2026-08-08': { emoji: '🏛️', label: 'Sexta, 08/08', description: '~6h · Municípios + Deploy Sprint 1', isWeekend: false },
  '2026-08-09': { emoji: '🔄', label: 'Sáb-Dom, 09-10/08', description: 'Municípios importação + Testes regressivos', isWeekend: true, weekendHours: '8h' },
  '2026-08-11': { emoji: '📊', label: 'Seg, 11/08', description: '~6h · Banco: auditoria + contadores', isWeekend: false },
  '2026-08-12': { emoji: '🔧', label: 'Ter-Qua, 12-13/08', description: '~12h · Refatorar calculoController.js', isWeekend: false },
  '2026-08-14': { emoji: '🔧', label: 'Qui-Sex, 14-15/08', description: '~12h · Repository Layer + Testes', isWeekend: false },
  '2026-08-16': { emoji: '🔄', label: 'Sáb-Dom, 16-17/08', description: 'Infra + Frontend CDN', isWeekend: true, weekendHours: '8h' },
  '2026-08-18': { emoji: '🚀', label: 'Seg-Sex, 18-22/08', description: '~30h · Finalização Sprint 2 + Planning Sprint 3', isWeekend: false },
  '2026-08-25': { emoji: '✨', label: '25/08 → 12/09', description: 'Detalhado ao início do Sprint 2', isWeekend: false },
  '2026-09-15': { emoji: '💰', label: 'Segunda, 15/09', description: '~1h · Fase 1: limpar recursos parados e travar orçamento', isWeekend: false },
  '2026-09-16': { emoji: '💰', label: 'Terça, 16/09', description: '~1.5h · Fase 2: downsize homolog + agendamento de stop/start', isWeekend: false },
  '2026-09-17': { emoji: '💰', label: 'Quarta, 17/09', description: '~1h · Fase 2: downsize apresentação + frontend', isWeekend: false },
  '2026-09-18': { emoji: '💰', label: 'Quinta, 18/09', description: '~15min · Fase 2: validar memória A1 dentro do gratuito', isWeekend: false },
  '2026-09-19': { emoji: '💰', label: 'Sexta, 19/09', description: '~15min · Fase 2: confirmar Compute em R$0,00/dia', isWeekend: false },
  '2026-09-22': { emoji: '💰', label: 'Segunda, 22/09', description: '~5h · Fase 3: migrar backend da Container Instance para VM A1', isWeekend: false },
  '2026-09-23': { emoji: '💰', label: 'Terça, 23/09', description: '~2h · Fase 3: validar novo fluxo de deploy em homolog', isWeekend: false },
  '2026-09-24': { emoji: '💰', label: 'Quarta, 24/09', description: '~1.5h · Fase 3: cutover em produção + Fase 4: quota policies', isWeekend: false },
  '2026-09-25': { emoji: '💰', label: 'Quinta, 25/09', description: '~50min · Fase 4: documentar regra e confirmar com suporte Oracle', isWeekend: false },
  '2026-10-26': { emoji: '🎓', label: 'Segunda, 26/10', description: '~6h · Tutorial: componente reutilizável + tours por passo', isWeekend: false },
  '2026-10-27': { emoji: '🎓', label: 'Terça, 27/10', description: '~6h · Tutorial: “já visto” no banco + Central de Tutoriais', isWeekend: false },
  '2026-10-28': { emoji: '🎓', label: 'Quarta, 28/10', description: '~6h · Tours: Dashboard, clientes e vínculos', isWeekend: false },
  '2026-10-29': { emoji: '🎓', label: 'Quinta, 29/10', description: '~6h · Tours: contribuições, ficha funcional, central de cálculos', isWeekend: false },
  '2026-10-30': { emoji: '🎓', label: 'Sexta, 30/10', description: '~6h · Tours: assistentes RGPS e RPPS', isWeekend: false },
  '2026-11-03': { emoji: '🎓', label: 'Terça, 03/11', description: '~6.5h · Tours: integralidade, sentença, simulador (02/11 feriado)', isWeekend: false },
  '2026-11-04': { emoji: '🎓', label: 'Quarta, 04/11', description: '~6h · Tours: relatórios, regras, telas de apoio', isWeekend: false },
  '2026-11-05': { emoji: '🎓', label: 'Quinta, 05/11', description: '~6.5h · Tours de admin + revisão jurídica dos exemplos', isWeekend: false },
  '2026-11-06': { emoji: '🎓', label: 'Sexta, 06/11', description: '~4h · QA em homolog + deploy', isWeekend: false }
};
