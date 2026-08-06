// ═══════════ TASK DATA ═══════════
// All tasks, sprints, milestones, and day metadata for the ServCalc Dev Calendar

const SPRINTS_DATA = [
  { id: 0, number: 0, title: 'Ambiente de Homologação + Segurança Crítica', period: '26/07 (Sáb) → 29/07 (Ter) · Nenhum deploy em produção antes de concluir', colorClass: 's0', collapsed: false },
  { id: 1, number: 1, title: '🚨 Bugs Críticos + Banco + Legislações', period: '30/07 (Qua) → 10/08 (Dom) · Todo deploy passa por homolog primeiro', colorClass: 's1', collapsed: false },
  { id: 2, number: 2, title: '🔧 Refatoração Técnica + Auditoria', period: '11/08 (Seg) → 24/08 (Dom)', colorClass: 's2', collapsed: true },
  { id: 3, number: 3, title: '✨ Polimento e Features Avançadas', period: '25/08 (Seg) → 12/09 (Sex)', colorClass: 's3', collapsed: true }
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
  { id: 's3-01', sprint: 3, date: '2026-08-25', text: 'Sprint 3 será detalhado ao final do Sprint 2', tags: [], hours: '' }
];

const MILESTONES_DATA = [
  { date: '26-27/07', text: '🔐 Segurança crítica corrigida + Scripts de homolog criados', done: true },
  { date: '28/07', text: '🏗️ <strong>Ambiente de homologação funcionando</strong>', done: true },
  { date: '29/07', text: '✅ Correções de segurança em produção via homolog', done: true },
  { date: '31/07', text: '🐛 Bugs de RGPS, integralidade e paridade corrigidos', done: true },
  { date: '08/08', text: '🧑‍⚖️ Sprint 1 entregue — features de usuário, PDF e municípios', done: false },
  { date: '22/08', text: '🔧 Sprint 2 entregue — código refatorado e testável', done: false },
  { date: '12/09', text: '✨ Sprint 3 entregue — produto estável e diferenciado', done: false }
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
  '2026-08-25': { emoji: '✨', label: '25/08 → 12/09', description: 'Detalhado ao início do Sprint 2', isWeekend: false }
};
