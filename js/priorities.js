// ═══════════ PRIORITIES ENGINE ═══════════
// Analyzes tasks by date, urgency, and status to generate daily priorities

const Priorities = (() => {
  
  // ── Get today's date string ──
  function getTodayStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function formatDateBR(dateStr) {
    const d = parseDate(dateStr);
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${dias[d.getDay()]}, ${d.getDate()}/${meses[d.getMonth()]}`;
  }

  // ── Priority scoring ──
  const TAG_WEIGHTS = {
    custo: 12,
    seguranca: 10,
    bug: 8,
    feedback: 5,
    banco: 5,
    homolog: 4,
    tecnico: 3
  };

  function getTaskPriority(task) {
    let score = 0;
    (task.tags || []).forEach(tag => {
      score += TAG_WEIGHTS[tag] || 0;
    });
    // Sprint 0 tasks are more urgent
    if (task.sprint === 0) score += 5;
    if (task.sprint === 1) score += 3;
    return score;
  }

  function getPriorityLabel(score) {
    if (score >= 12) return { label: 'Crítico', emoji: '🔴', class: 'critical' };
    if (score >= 8) return { label: 'Alto', emoji: '🟠', class: 'high' };
    if (score >= 5) return { label: 'Médio', emoji: '🟡', class: 'medium' };
    return { label: 'Normal', emoji: '🟢', class: 'normal' };
  }

  // ── Analyze priorities ──
  function analyzePriorities(tasks, taskStates) {
    const today = getTodayStr();
    const todayDate = parseDate(today);

    const result = {
      today: [],
      overdue: [],
      upcoming: [],  // next 3 days
      totalPending: 0,
      totalDone: 0,
      totalHoursToday: 0,
      totalHoursOverdue: 0
    };

    tasks.forEach(task => {
      const state = taskStates[task.id];
      const isDone = state ? state.done : false;

      if (isDone) {
        result.totalDone++;
        return;
      }

      result.totalPending++;
      const taskDate = parseDate(task.date);
      const diffDays = Math.floor((taskDate - todayDate) / (1000 * 60 * 60 * 24));

      const priorityScore = getTaskPriority(task);
      const priorityInfo = getPriorityLabel(priorityScore);

      const enrichedTask = {
        ...task,
        priorityScore,
        priorityInfo,
        diffDays
      };

      if (diffDays < 0) {
        // Overdue
        result.overdue.push(enrichedTask);
        result.totalHoursOverdue += parseHours(task.hours);
      } else if (diffDays === 0) {
        // Today
        result.today.push(enrichedTask);
        result.totalHoursToday += parseHours(task.hours);
      } else if (diffDays <= 3) {
        // Upcoming
        result.upcoming.push(enrichedTask);
      }
    });

    // Sort by priority (highest first)
    result.overdue.sort((a, b) => b.priorityScore - a.priorityScore);
    result.today.sort((a, b) => b.priorityScore - a.priorityScore);
    result.upcoming.sort((a, b) => a.diffDays - b.diffDays || b.priorityScore - a.priorityScore);

    return result;
  }

  function parseHours(hoursStr) {
    if (!hoursStr) return 0;
    const h = hoursStr.match(/(\d+\.?\d*)h/);
    const m = hoursStr.match(/(\d+)\s*min/);
    let total = 0;
    if (h) total += parseFloat(h[1]);
    if (m) total += parseInt(m[1]) / 60;
    return total;
  }

  // ── Generate email content ──
  function generateEmailHTML(priorities) {
    const today = formatDateBR(getTodayStr());
    let html = `
      <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0e14;color:#e8edf5;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#2563eb,#a78bfa);padding:24px 28px;">
          <h1 style="margin:0;font-size:20px;color:#fff;">📅 Prioridades do Dia — ServCalc</h1>
          <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">${today}</p>
        </div>
        <div style="padding:24px 28px;">
    `;

    // Summary
    html += `
      <div style="display:flex;gap:12px;margin-bottom:20px;">
        <div style="flex:1;background:#1a2030;border-radius:8px;padding:14px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#5b9aff;">${priorities.today.length}</div>
          <div style="font-size:11px;color:#8b95a8;margin-top:4px;">Hoje</div>
        </div>
        <div style="flex:1;background:#1a2030;border-radius:8px;padding:14px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#f87171;">${priorities.overdue.length}</div>
          <div style="font-size:11px;color:#8b95a8;margin-top:4px;">Atrasadas</div>
        </div>
        <div style="flex:1;background:#1a2030;border-radius:8px;padding:14px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#34d399;">${priorities.totalDone}</div>
          <div style="font-size:11px;color:#8b95a8;margin-top:4px;">Feitas</div>
        </div>
      </div>
    `;

    // Overdue tasks
    if (priorities.overdue.length > 0) {
      html += `<h2 style="font-size:14px;color:#f87171;margin:16px 0 10px;">🔴 Atrasadas (${priorities.overdue.length})</h2>`;
      priorities.overdue.slice(0, 10).forEach(t => {
        html += taskEmailCard(t, true);
      });
    }

    // Today's tasks
    if (priorities.today.length > 0) {
      html += `<h2 style="font-size:14px;color:#5b9aff;margin:16px 0 10px;">📌 Hoje (${priorities.today.length}) — ~${priorities.totalHoursToday.toFixed(1)}h</h2>`;
      priorities.today.forEach(t => {
        html += taskEmailCard(t, false);
      });
    }

    // Upcoming
    if (priorities.upcoming.length > 0) {
      html += `<h2 style="font-size:14px;color:#fbbf24;margin:16px 0 10px;">📋 Próximos 3 dias (${priorities.upcoming.length})</h2>`;
      priorities.upcoming.slice(0, 5).forEach(t => {
        html += taskEmailCard(t, false);
      });
    }

    // Footer
    html += `
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #2a3344;text-align:center;">
        <a href="${CONFIG.BASE_URL}" style="color:#5b9aff;text-decoration:none;font-size:13px;font-weight:600;">
          Abrir Dashboard Completo →
        </a>
      </div>
    </div></div>`;

    return html;
  }

  function taskEmailCard(task, isOverdue) {
    const bgColor = isOverdue ? 'rgba(248,113,113,0.1)' : '#1a2030';
    const borderColor = isOverdue ? 'rgba(248,113,113,0.3)' : '#2a3344';
    // Strip HTML from task text for email
    const plainText = task.text.replace(/<[^>]*>/g, '');
    return `
      <div style="background:${bgColor};border:1px solid ${borderColor};border-radius:8px;padding:10px 14px;margin-bottom:6px;">
        <div style="font-size:13px;line-height:1.5;">${task.priorityInfo.emoji} ${plainText}</div>
        <div style="font-size:11px;color:#5a6578;margin-top:4px;">Sprint ${task.sprint} · ${task.hours}</div>
      </div>
    `;
  }

  // ── Generate plain text summary ──
  function generateSummaryText(priorities) {
    const today = formatDateBR(getTodayStr());
    let text = `📅 PRIORIDADES DO DIA — SERVCALC\n${today}\n\n`;

    if (priorities.overdue.length > 0) {
      text += `🔴 ATRASADAS (${priorities.overdue.length}):\n`;
      priorities.overdue.forEach((t, i) => {
        const plainText = t.text.replace(/<[^>]*>/g, '');
        text += `  ${i + 1}. ${plainText} [${t.hours}]\n`;
      });
      text += '\n';
    }

    if (priorities.today.length > 0) {
      text += `📌 HOJE (${priorities.today.length}) — ~${priorities.totalHoursToday.toFixed(1)}h:\n`;
      priorities.today.forEach((t, i) => {
        const plainText = t.text.replace(/<[^>]*>/g, '');
        text += `  ${i + 1}. ${plainText} [${t.hours}]\n`;
      });
      text += '\n';
    }

    text += `📊 Total: ${priorities.totalDone} feitas | ${priorities.totalPending} pendentes\n`;
    text += `🔗 ${CONFIG.BASE_URL}`;

    return text;
  }

  // ── Public API ──
  return {
    analyzePriorities,
    generateEmailHTML,
    generateSummaryText,
    getTodayStr,
    formatDateBR,
    parseDate,
    getTaskPriority,
    getPriorityLabel,
    parseHours
  };
})();
