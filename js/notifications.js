// ═══════════ NOTIFICATIONS MODULE ═══════════
// Handles email sending via ServCalc backend (OCI Email Delivery)

const Notifications = (() => {
  let emailSentToday = false;

  // ── Initialize ──
  function init() {
    // Check if email was already sent today
    const lastSent = localStorage.getItem('scalc_email_last_sent');
    if (lastSent === Priorities.getTodayStr()) {
      emailSentToday = true;
    }

    // Check if we should auto-send at configured time
    checkScheduledEmail();

    return true;
  }

  // ── Send priority email via OCI SMTP (through ServCalc backend) ──
  async function sendPriorityEmail(priorities) {
    if (!CONFIG.SERVCALC_API_URL || !CONFIG.DASHBOARD_API_KEY) {
      App.showToast('API do ServCalc não configurada.', 'warning');
      return false;
    }

    try {
      const emailHTML = Priorities.generateEmailHTML(priorities);
      const summaryText = Priorities.generateSummaryText(priorities);
      const todayStr = Priorities.formatDateBR(Priorities.getTodayStr());

      const response = await fetch(`${CONFIG.SERVCALC_API_URL}/dashboard/send-priority-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dashboard-key': CONFIG.DASHBOARD_API_KEY
        },
        body: JSON.stringify({
          to: CONFIG.NOTIFY_EMAIL,
          subject: `📅 Prioridades do Dia — ServCalc (${todayStr})`,
          html: emailHTML,
          text: summaryText
        })
      });

      const data = await response.json();

      if (data.success) {
        emailSentToday = true;
        localStorage.setItem('scalc_email_last_sent', Priorities.getTodayStr());
        App.showToast(`📧 Email enviado para ${CONFIG.NOTIFY_EMAIL} via OCI`, 'success');
        return true;
      } else {
        App.showToast('Erro ao enviar email: ' + (data.error || 'Desconhecido'), 'error');
      }
    } catch (e) {
      console.error('[Notifications] Email send failed:', e);
      App.showToast('Erro ao conectar com a API: ' + e.message, 'error');
    }
    return false;
  }

  // ── Scheduled email check ──
  function checkScheduledEmail() {
    if (emailSentToday) return;

    const now = new Date();
    const [targetH, targetM] = CONFIG.EMAIL_TIME.split(':').map(Number);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const targetMinutes = targetH * 60 + targetM;

    // If we're past the target time and haven't sent yet, offer to send
    if (currentMinutes >= targetMinutes) {
      console.log('[Notifications] Past scheduled time (18:30), auto-sending email...');
      setTimeout(() => {
        const tasks = typeof TASKS_DATA !== 'undefined' ? TASKS_DATA : [];
        const states = GoogleSync.getTaskStates();
        const priorities = Priorities.analyzePriorities(tasks, states);
        if (priorities.today.length > 0 || priorities.overdue.length > 0) {
          sendPriorityEmail(priorities);
        }
      }, 3000);
    } else {
      // Schedule for the target time
      const msUntilTarget = (targetMinutes - currentMinutes) * 60 * 1000;
      console.log(`[Notifications] Agendando email em ${Math.round(msUntilTarget / 60000)} minutos`);
      setTimeout(() => {
        const tasks = typeof TASKS_DATA !== 'undefined' ? TASKS_DATA : [];
        const states = GoogleSync.getTaskStates();
        const priorities = Priorities.analyzePriorities(tasks, states);
        if (priorities.today.length > 0 || priorities.overdue.length > 0) {
          sendPriorityEmail(priorities);
        }
      }, msUntilTarget);
    }
  }

  // ── Browser notifications ──
  async function requestBrowserPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  function showBrowserNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notif = new Notification(title, {
        body,
        icon: '📅',
        badge: '📅',
        tag: 'scalc-dashboard'
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      setTimeout(() => notif.close(), 8000);
    }
  }

  // ── Public API ──
  return {
    init,
    sendPriorityEmail,
    requestBrowserPermission,
    showBrowserNotification,
    isEmailSentToday: () => emailSentToday,
    isConfigured: () => !!CONFIG.SERVCALC_API_URL
  };
})();
