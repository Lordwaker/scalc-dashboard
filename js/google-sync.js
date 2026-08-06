// ═══════════ GOOGLE SYNC MODULE ═══════════
// Handles all communication with Google Apps Script backend

const GoogleSync = (() => {
  let lastSyncTime = null;
  let syncStatus = 'offline'; // 'online', 'offline', 'syncing'
  let docContent = null;
  let taskStates = {};

  // ── Fetch wrapper ──
  async function apiFetch(action, method = 'GET', body = null) {
    if (!CONFIG.APPS_SCRIPT_URL) {
      console.warn('[GoogleSync] Apps Script URL not configured');
      return null;
    }

    const url = method === 'GET'
      ? `${CONFIG.APPS_SCRIPT_URL}?action=${action}`
      : CONFIG.APPS_SCRIPT_URL;

    try {
      setSyncStatus('syncing');
      const options = {
        method,
        headers: { 'Content-Type': 'text/plain' },
        redirect: 'follow'
      };

      if (method === 'POST') {
        options.body = JSON.stringify({ action, ...body });
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (data.success) {
        setSyncStatus('online');
        lastSyncTime = new Date();
        return data.data;
      } else {
        console.error('[GoogleSync] API error:', data.error);
        setSyncStatus('offline');
        return null;
      }
    } catch (err) {
      console.error('[GoogleSync] Network error:', err);
      setSyncStatus('offline');
      return null;
    }
  }

  // ── Status management ──
  function setSyncStatus(status) {
    syncStatus = status;
    updateSyncUI();
  }

  function updateSyncUI() {
    const dot = document.getElementById('sync-dot');
    const text = document.getElementById('sync-text');
    if (!dot || !text) return;

    dot.className = 'sync-dot ' + (syncStatus === 'online' ? '' : syncStatus);

    if (syncStatus === 'syncing') {
      text.textContent = 'Sincronizando...';
    } else if (syncStatus === 'online' && lastSyncTime) {
      const ago = Math.round((Date.now() - lastSyncTime.getTime()) / 1000);
      text.textContent = ago < 5 ? 'Sincronizado agora' :
        ago < 60 ? `Sincronizado há ${ago}s` :
        `Sincronizado há ${Math.round(ago / 60)}min`;
    } else {
      text.textContent = 'Offline — usando dados locais';
    }
  }

  // ── Task state sync ──
  async function loadTaskStates() {
    const data = await apiFetch('getTasks');
    if (data && Array.isArray(data)) {
      taskStates = {};
      data.forEach(row => {
        taskStates[row.taskId] = {
          done: row.done === true || row.done === 'TRUE',
          updatedBy: row.updatedBy || '',
          updatedAt: row.updatedAt || ''
        };
      });
      return taskStates;
    }
    // Fallback to localStorage
    return loadLocalStates();
  }

  async function saveTaskState(taskId, done, userName) {
    // Save locally first (optimistic)
    saveLocalState(taskId, done);

    // Then sync to Google Sheet
    const result = await apiFetch('updateTask', 'POST', {
      taskId,
      done,
      updatedBy: userName || 'Anônimo'
    });

    if (!result) {
      console.warn('[GoogleSync] Failed to sync task, saved locally');
    }
    return result;
  }

  // ── Google Doc content ──
  async function loadDocContent() {
    // Try via Apps Script
    const data = await apiFetch(`getDoc&docId=${CONFIG.GOOGLE_DOC_ID}`);
    if (data) {
      docContent = data;
      return data;
    }

    // Fallback: try direct export (works if doc is public)
    try {
      const url = `https://docs.google.com/document/d/${CONFIG.GOOGLE_DOC_ID}/export?format=html`;
      const resp = await fetch(url);
      if (resp.ok) {
        const html = await resp.text();
        docContent = parseDocHTML(html);
        return docContent;
      }
    } catch (e) {
      console.warn('[GoogleSync] Direct doc fetch failed:', e);
    }

    return null;
  }

  function parseDocHTML(html) {
    // Extract just the body content from Google's exported HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.querySelector('body');
    if (!body) return html;

    // Clean up Google's styling
    body.querySelectorAll('style').forEach(el => el.remove());
    body.querySelectorAll('[style]').forEach(el => {
      // Keep some useful styles, remove Google's verbose ones
      el.removeAttribute('style');
    });

    return body.innerHTML;
  }

  // ── Local storage fallback ──
  function loadLocalStates() {
    try {
      const stored = localStorage.getItem('scalc_dashboard_states');
      if (stored) {
        taskStates = JSON.parse(stored);
        return taskStates;
      }
    } catch (e) {}
    return {};
  }

  function saveLocalState(taskId, done) {
    taskStates[taskId] = {
      done,
      updatedBy: 'local',
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('scalc_dashboard_states', JSON.stringify(taskStates));
    } catch (e) {}
  }

  // ── Migrate from old calendar localStorage ──
  function migrateOldData() {
    try {
      const oldData = localStorage.getItem('scalc_tasks_v2');
      if (oldData && !localStorage.getItem('scalc_dashboard_migrated')) {
        const states = JSON.parse(oldData);
        console.log('[GoogleSync] Found old calendar data, migrating', states.length, 'task states');
        // Map old indices to new task IDs
        const allTasks = typeof TASKS_DATA !== 'undefined' ? TASKS_DATA : [];
        states.forEach((checked, i) => {
          if (checked && allTasks[i]) {
            taskStates[allTasks[i].id] = { done: true, updatedBy: 'migrated', updatedAt: new Date().toISOString() };
          }
        });
        localStorage.setItem('scalc_dashboard_states', JSON.stringify(taskStates));
        localStorage.setItem('scalc_dashboard_migrated', 'true');
        return true;
      }
    } catch (e) { console.warn('Migration failed:', e); }
    return false;
  }

  // ── Auto-refresh timer ──
  let syncTimer = null;
  function startAutoSync() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(async () => {
      await loadTaskStates();
      if (typeof App !== 'undefined') App.applyStates();
      updateSyncUI();
    }, CONFIG.SYNC_INTERVAL);

    // Also update the "ago" text every 10s
    setInterval(updateSyncUI, 10000);
  }

  function stopAutoSync() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = null;
  }

  // ── Public API ──
  return {
    loadTaskStates,
    saveTaskState,
    loadDocContent,
    migrateOldData,
    startAutoSync,
    stopAutoSync,
    updateSyncUI,
    getTaskStates: () => taskStates,
    getDocContent: () => docContent,
    getSyncStatus: () => syncStatus,
    getLastSyncTime: () => lastSyncTime,
    isConfigured: () => !!CONFIG.APPS_SCRIPT_URL
  };
})();
