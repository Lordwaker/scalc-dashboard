// ═══════════ CONFIGURATION ═══════════
const CONFIG = {
  // Google Doc ID (from the URL of your improvements document)
  GOOGLE_DOC_ID: '1XT3b3NXLWz7sAzhCk-7rllPxXa1c5BU5ejMtxyWPt-4',

  // Google Apps Script Web App URL (paste after deploying the Apps Script)
  APPS_SCRIPT_URL: '',

  // ServCalc Backend API (para envio de email via OCI SMTP)
  SERVCALC_API_URL: 'https://servcalc.com.br/api',
  DASHBOARD_API_KEY: 'scalc-dash-2026-prioridades',

  // Notification email
  NOTIFY_EMAIL: 'thiago.ferreira@servcalc.com.br',

  // Priority email time (24h format)
  EMAIL_TIME: '18:30',

  // Auto-sync interval (milliseconds)
  SYNC_INTERVAL: 30000, // 30 seconds

  // Doc refresh interval (milliseconds)
  DOC_REFRESH_INTERVAL: 300000, // 5 minutes

  // GitHub Pages base (for sharing)
  BASE_URL: 'https://lordwaker.github.io/scalc-dashboard'
};
