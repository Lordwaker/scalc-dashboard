// ═══════════ MAIN APPLICATION ═══════════
// Orchestrates all modules and renders the dashboard

const App = (() => {
  let activeFilter = 'all';
  let userName = '';

  // ── Helper: Combine static tasks + dynamic custom tasks ──
  function getAllTasks() {
    const custom = (typeof GoogleSync !== 'undefined' && GoogleSync.getCustomTasks) ? GoogleSync.getCustomTasks() : [];
    const staticTasks = typeof TASKS_DATA !== 'undefined' ? TASKS_DATA : [];
    return [...staticTasks, ...custom];
  }

  // ── Initialize ──
  async function init() {
    console.log('[App] Initializing ServCalc Dashboard...');

    // Get or set user name
    userName = localStorage.getItem('scalc_username') || '';
    if (!userName) {
      userName = prompt('Qual é o seu nome? (para identificar quem atualizou as tasks)') || 'Anônimo';
      localStorage.setItem('scalc_username', userName);
    }

    // Load custom tasks from Google Sheet / localStorage
    await GoogleSync.loadCustomTasks();

    // Render the dashboard structure
    renderSprints();
    renderMilestones();

    // Load task states (try Google Sheets first, fallback to localStorage)
    GoogleSync.migrateOldData();
    await GoogleSync.loadTaskStates();
    applyStates();

    // Load Google Doc content
    loadDocContent();

    // Calculate and render priorities
    updatePriorities();

    // Update all progress bars
    updateAllProgress();

    // Setup auto-sync
    GoogleSync.startAutoSync();

    // Initialize notifications
    await Notifications.init();
    Notifications.requestBrowserPermission();

    // Setup scroll listener
    window.addEventListener('scroll', () => {
      const btn = document.getElementById('scroll-top');
      if (btn) btn.classList.toggle('visible', window.scrollY > 300);
    });

    // Update tab title with pending count
    updateTabTitle();

    // Hide loading overlay
    setTimeout(() => {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) overlay.classList.add('hidden');
    }, 600);

    console.log('[App] Dashboard initialized');
  }

  // ── Render sprints and tasks ──
  function renderSprints() {
    const container = document.getElementById('sprints-container');
    if (!container) return;

    let html = '';
    SPRINTS_DATA.forEach(sprint => {
      const collapsedClass = sprint.collapsed ? ' collapsed' : '';
      html += `
        <div class="sprint ${sprint.colorClass}${collapsedClass}" id="sprint-${sprint.id}">
          <div class="sprint-header" onclick="App.toggleSprint('sprint-${sprint.id}')">
            <div class="sprint-meta">
              <div class="sprint-num">${sprint.id === 0 ? '🏗️ Sprint 0 — PRIORIDADE MÁXIMA' : `Sprint ${sprint.id}`}</div>
              <div class="sprint-title">${sprint.title}</div>
              <div class="sprint-period">${sprint.period}</div>
            </div>
            <div class="sprint-progress-wrap">
              <div class="sprint-progress-bar-wrap">
                <div class="sprint-progress-bar" id="sprint-${sprint.id}-bar" style="width:0%"></div>
              </div>
              <div class="sprint-pct" id="sprint-${sprint.id}-pct">0%</div>
            </div>
            <span class="chevron">▼</span>
          </div>
          <div class="sprint-body">
            ${renderSprintDays(sprint.id)}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function renderSprintDays(sprintId) {
    const sprintTasks = getAllTasks().filter(t => t.sprint === sprintId);
    const today = Priorities.getTodayStr();

    // Group tasks by date
    const tasksByDate = {};
    sprintTasks.forEach(task => {
      const d = task.date || today;
      if (!tasksByDate[d]) tasksByDate[d] = [];
      tasksByDate[d].push(task);
    });

    // Get day metadata
    let html = '';

    // Sprint 0 special note
    if (sprintId === 0) {
      html += `
        <div class="section-note">
          ℹ️ <strong>Por que prioridade máxima?</strong> O ambiente de homologação protege seus clientes de bugs introduzidos durante o desenvolvimento das melhorias.
        </div>
      `;
    }

    // Render days
    const dates = Object.keys(tasksByDate).sort();
    dates.forEach(date => {
      const dayInfo = (typeof DAYS_DATA !== 'undefined' && DAYS_DATA[date]) || {};
      const isToday = date === today;

      html += `<div class="day">`;
      html += `<div class="day-header">`;
      html += `<div class="day-date${isToday ? ' today' : ''}">${dayInfo.emoji || '📋'} ${dayInfo.label || Priorities.formatDateBR(date)}</div>`;
      if (isToday) html += `<span class="today-badge">HOJE</span>`;
      if (dayInfo.isWeekend && dayInfo.weekendHours) {
        html += `<span class="weekend-badge">FDS — ${dayInfo.weekendHours}</span>`;
      }
      if (dayInfo.description) {
        html += `<div class="day-desc">${dayInfo.description}</div>`;
      }
      html += `</div>`;

      // Render tasks for this day
      tasksByDate[date].forEach(task => {
        html += renderTask(task);
      });

      html += `</div>`;
    });

    // Sprint 3 placeholder
    if (sprintId === 3 && sprintTasks.length <= 1) {
      html += `
        <div class="day">
          <div class="day-header">
            <div class="day-date">✨ 25/08 → 12/09</div>
            <div class="day-desc">Detalhado ao início do Sprint 2</div>
          </div>
          <div class="placeholder-card">
            🧩 Sprint 3 será detalhado ao final do Sprint 2
            <p>Temas previstos: Jaden mais inteligente · Relatórios comparativos · Sistema de notificações internas · Performance frontend · Cadastro colaborativo de legislações · Melhorias de PDF avançadas</p>
          </div>
        </div>
      `;
    }

    return html;
  }

  function renderTask(task) {
    const tagsStr = (task.tags || []).join(' ');
    const tagsHTML = (task.tags || []).map(tag => {
      const labels = {
        seguranca: '🔐 Segurança', bug: '🐛 Bug', feedback: '🧑‍⚖️ Feedback',
        tecnico: '⚙️ Técnico', banco: '📊 Banco', homolog: '🏗️ Homolog'
      };
      return `<span class="tag tag-${tag}">${labels[tag] || tag}</span>`;
    }).join('');

    const customBadge = task.isCustom ? '<span class="tag" style="background:rgba(168,85,247,0.2);color:#c084fc;border:1px solid rgba(168,85,247,0.3);">✨ Nova</span>' : '';

    return `
      <div class="task" data-task-id="${task.id}" data-tags="${tagsStr}">
        <input type="checkbox" class="task-cb" id="cb-${task.id}" onchange="App.taskChange('${task.id}', this.checked)">
        <div class="task-content">
          <div class="task-text">${task.text} ${customBadge}</div>
          <div class="task-meta">${tagsHTML}</div>
        </div>
        <div class="task-hours">${task.hours}</div>
      </div>
    `;
  }

  // ── Apply task states from sync ──
  function applyStates() {
    const states = GoogleSync.getTaskStates();
    Object.entries(states).forEach(([taskId, state]) => {
      const cb = document.getElementById(`cb-${taskId}`);
      if (cb) {
        cb.checked = state.done;
        const taskEl = cb.closest('.task');
        if (taskEl) taskEl.classList.toggle('done', state.done);
      }
    });
    updateAllProgress();
    updatePriorities();
    updateTabTitle();
  }

  // ── Task change handler ──
  async function taskChange(taskId, checked) {
    const taskEl = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskEl) {
      taskEl.classList.toggle('done', checked);
    }

    // Save state
    await GoogleSync.saveTaskState(taskId, checked, userName);

    // Update UI
    updateAllProgress();
    updatePriorities();
    updateTabTitle();

    // Show toast
    const allTasks = getAllTasks();
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      const plainText = task.text.replace(/<[^>]*>/g, '').substring(0, 50);
      if (checked) {
        showToast(`✅ "${plainText}" concluída!`, 'success');
      } else {
        showToast(`↩️ "${plainText}" desmarcada`, 'info');
      }
    }
  }

  // ── Progress calculations ──
  function updateAllProgress() {
    const allCbs = [...document.querySelectorAll('.task-cb')];
    const doneCbs = allCbs.filter(c => c.checked);
    const total = allCbs.length;
    const done = doneCbs.length;
    const pending = total - done;
    const pct = total ? Math.round(done / total * 100) : 0;

    // Global
    const gPct = document.getElementById('global-pct');
    const gBar = document.getElementById('global-bar');
    const dCount = document.getElementById('done-count');
    const pCount = document.getElementById('pending-count');
    const tCount = document.getElementById('total-count');

    if (gPct) gPct.textContent = pct + '%';
    if (gBar) gBar.style.width = pct + '%';
    if (dCount) dCount.textContent = done;
    if (pCount) pCount.textContent = pending;
    if (tCount) tCount.textContent = total;

    // Per sprint
    SPRINTS_DATA.forEach(sprint => {
      const sprintEl = document.getElementById(`sprint-${sprint.id}`);
      if (!sprintEl) return;
      const cbs = [...sprintEl.querySelectorAll('.task-cb')];
      const d = cbs.filter(c => c.checked).length;
      const p = cbs.length ? Math.round(d / cbs.length * 100) : 0;
      const bar = document.getElementById(`sprint-${sprint.id}-bar`);
      const pctEl = document.getElementById(`sprint-${sprint.id}-pct`);
      if (bar) bar.style.width = p + '%';
      if (pctEl) pctEl.textContent = p + '%';
    });
  }

  // ── Priority panel ──
  function updatePriorities() {
    const states = GoogleSync.getTaskStates();
    const allTasks = getAllTasks();
    const priorities = Priorities.analyzePriorities(allTasks, states);

    const body = document.getElementById('priority-body');
    const dateBadge = document.getElementById('priority-date');
    if (!body) return;

    if (dateBadge) {
      dateBadge.textContent = Priorities.formatDateBR(Priorities.getTodayStr());
    }

    const all = [...priorities.overdue, ...priorities.today];
    if (all.length === 0) {
      body.innerHTML = `
        <div class="priority-empty">
          <span class="emoji">🎉</span>
          Nenhuma tarefa para hoje ou atrasada!<br>Continue o bom trabalho.
        </div>
      `;
      return;
    }

    let html = '<div class="priority-cards">';

    // Overdue first
    priorities.overdue.forEach(task => {
      const plainText = task.text.replace(/<[^>]*>/g, '');
      const daysOverdue = Math.abs(task.diffDays);
      html += `
        <div class="priority-card overdue" onclick="App.scrollToTask('${task.id}')">
          <div class="p-icon">${task.priorityInfo.emoji}</div>
          <div class="p-content">
            <div class="p-text">${plainText}</div>
            <div class="p-meta">
              <span class="tag tag-overdue">🔴 ${daysOverdue}d atrasada</span>
              <span class="p-sprint">Sprint ${task.sprint} · ${task.hours}</span>
            </div>
          </div>
        </div>
      `;
    });

    // Today tasks
    priorities.today.forEach(task => {
      const plainText = task.text.replace(/<[^>]*>/g, '');
      html += `
        <div class="priority-card today" onclick="App.scrollToTask('${task.id}')">
          <div class="p-icon">${task.priorityInfo.emoji}</div>
          <div class="p-content">
            <div class="p-text">${plainText}</div>
            <div class="p-meta">
              <span class="tag tag-today">🟡 Hoje</span>
              <span class="p-sprint">Sprint ${task.sprint} · ${task.hours}</span>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';

    // Summary line
    html += `
      <div class="priority-summary-line">
        <span>⏱️ <strong>${priorities.totalHoursToday.toFixed(1)}h</strong> de trabalho planejado para hoje</span>
        <span>•</span>
        <span>📊 <strong>${priorities.overdue.length}</strong> atrasadas / <strong>${priorities.today.length}</strong> para hoje</span>
      </div>
    `;

    body.innerHTML = html;
  }

  // ── Google Doc content ──
  async function loadDocContent() {
    const docBody = document.getElementById('doc-body');
    if (!docBody) return;

    docBody.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3);">Carregando documento...</div>';

    const content = await GoogleSync.loadDocContent();
    if (content) {
      docBody.innerHTML = content + `
        <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
          <a href="https://docs.google.com/document/d/${CONFIG.GOOGLE_DOC_ID}/edit" target="_blank" class="doc-link-btn">
            📝 Abrir no Google Docs →
          </a>
        </div>
      `;
    } else {
      docBody.innerHTML = `
        <div style="text-align:center;padding:28px;">
          <div style="font-size:28px;margin-bottom:8px;">📄</div>
          <div style="color:var(--text2);font-size:13px;margin-bottom:12px;">
            Documento de melhorias conectado via Google Drive.
          </div>
          <a href="https://docs.google.com/document/d/${CONFIG.GOOGLE_DOC_ID}/edit" 
             target="_blank" class="doc-link-btn">
            📝 Abrir no Google Docs →
          </a>
        </div>
      `;
    }
  }

  // ── Render milestones ──
  function renderMilestones() {
    const container = document.getElementById('milestones-container');
    if (!container || typeof MILESTONES_DATA === 'undefined') return;
    container.innerHTML = MILESTONES_DATA.map(m => `
      <div class="milestone${m.done ? ' done-ms' : ''}">
        <div class="milestone-date">${m.date}</div>
        <div class="milestone-text">${m.text}</div>
      </div>
    `).join('');
  }

  // ── Sprint toggle ──
  function toggleSprint(sprintId) {
    const el = document.getElementById(sprintId);
    if (el) el.classList.toggle('collapsed');
  }

  // ── Filter handling ──
  function setFilter(filter, btn) {
    activeFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
      const isDone = task.classList.contains('done');
      const tags = (task.dataset.tags || '').split(' ');

      let visible = true;
      if (filter === 'pending') visible = !isDone;
      else if (filter === 'done') visible = isDone;
      else if (filter !== 'all') visible = tags.includes(filter);

      task.style.display = visible ? 'flex' : 'none';
    });
  }

  // ── Scroll to task ──
  function scrollToTask(taskId) {
    const taskEl = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskEl) {
      const sprint = taskEl.closest('.sprint');
      if (sprint && sprint.classList.contains('collapsed')) {
        sprint.classList.remove('collapsed');
      }
      taskEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      taskEl.style.transition = 'box-shadow 0.3s ease';
      taskEl.style.boxShadow = '0 0 0 2px var(--accent)';
      setTimeout(() => {
        taskEl.style.boxShadow = '';
      }, 2000);
    }
  }

  // ── Tab title ──
  function updateTabTitle() {
    const pending = document.querySelectorAll('.task-cb:not(:checked)').length;
    document.title = pending > 0
      ? `(${pending}) ServCalc Dev Dashboard`
      : '✅ ServCalc Dev Dashboard';
  }

  // ── Toast notifications ──
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ── Manual sync ──
  async function manualSync() {
    showToast('🔄 Sincronizando...', 'info');
    await Promise.all([GoogleSync.loadTaskStates(), GoogleSync.loadCustomTasks()]);
    renderSprints();
    applyStates();
    showToast('✅ Sincronizado com sucesso!', 'success');
  }

  // ── Manual email ──
  async function sendEmailNow() {
    const states = GoogleSync.getTaskStates();
    const allTasks = getAllTasks();
    const priorities = Priorities.analyzePriorities(allTasks, states);
    await Notifications.sendPriorityEmail(priorities);
  }

  // ── New Task Modal ──
  function showNewTaskModal() {
    const modal = document.getElementById('new-task-modal');
    if (modal) {
      modal.classList.add('visible');
      const textInput = document.getElementById('task-new-text');
      if (textInput) {
        textInput.value = '';
        setTimeout(() => textInput.focus(), 100);
      }
      const dateInput = document.getElementById('task-new-date');
      if (dateInput) dateInput.value = Priorities.getTodayStr();
    }
  }

  function closeNewTaskModal() {
    const modal = document.getElementById('new-task-modal');
    if (modal) modal.classList.remove('visible');
  }

  async function saveNewTask() {
    const textInput = document.getElementById('task-new-text');
    const text = textInput ? textInput.value.trim() : '';
    if (!text) {
      showToast('Por favor, informe o texto da tarefa.', 'warning');
      return;
    }

    const sprint = parseInt(document.getElementById('task-new-sprint').value) || 1;
    const date = document.getElementById('task-new-date').value || Priorities.getTodayStr();
    const hours = document.getElementById('task-new-hours').value.trim() || '1h';
    const tag = document.getElementById('task-new-tag').value || 'feedback';

    closeNewTaskModal();
    showToast('➕ Adicionando tarefa...', 'info');

    await GoogleSync.addCustomTask({
      sprint,
      date,
      text,
      tags: [tag],
      hours,
      createdBy: userName
    });

    renderSprints();
    applyStates();
    showToast('✨ Tarefa adicionada e sincronizada!', 'success');
  }

  // ── Config modal ──
  function showConfig() {
    const modal = document.getElementById('config-modal');
    if (modal) {
      modal.classList.add('visible');
      document.getElementById('cfg-script-url').value = CONFIG.APPS_SCRIPT_URL || '';
      document.getElementById('cfg-api-url').value = CONFIG.SERVCALC_API_URL || '';
      document.getElementById('cfg-api-key').value = CONFIG.DASHBOARD_API_KEY || '';
      document.getElementById('cfg-username').value = userName;
    }
  }

  function saveConfig() {
    CONFIG.APPS_SCRIPT_URL = document.getElementById('cfg-script-url').value.trim();
    CONFIG.SERVCALC_API_URL = document.getElementById('cfg-api-url').value.trim();
    CONFIG.DASHBOARD_API_KEY = document.getElementById('cfg-api-key').value.trim();
    userName = document.getElementById('cfg-username').value.trim() || 'Anônimo';

    // Save to localStorage
    localStorage.setItem('scalc_username', userName);
    localStorage.setItem('scalc_config', JSON.stringify({
      APPS_SCRIPT_URL: CONFIG.APPS_SCRIPT_URL,
      SERVCALC_API_URL: CONFIG.SERVCALC_API_URL,
      DASHBOARD_API_KEY: CONFIG.DASHBOARD_API_KEY
    }));

    closeConfig();
    showToast('⚙️ Configurações salvas!', 'success');

    // Re-initialize with new config
    GoogleSync.loadTaskStates().then(() => applyStates());
    Notifications.init();
  }

  function loadSavedConfig() {
    try {
      const saved = localStorage.getItem('scalc_config');
      if (saved) {
        const cfg = JSON.parse(saved);
        Object.assign(CONFIG, cfg);
      }
    } catch (e) {}
  }

  function closeConfig() {
    const modal = document.getElementById('config-modal');
    if (modal) modal.classList.remove('visible');
  }

  // ── Doc panel toggle ──
  function toggleDoc() {
    const panel = document.getElementById('doc-panel');
    if (panel) panel.classList.toggle('collapsed');
  }

  // ── Public API ──
  return {
    init,
    applyStates,
    taskChange,
    toggleSprint,
    setFilter,
    scrollToTask,
    showToast,
    manualSync,
    sendEmailNow,
    showNewTaskModal,
    closeNewTaskModal,
    saveNewTask,
    showConfig,
    saveConfig,
    closeConfig,
    loadSavedConfig,
    toggleDoc,
    updateAllProgress,
    updatePriorities
  };
})();

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => {
  App.loadSavedConfig();
  App.init();
});
