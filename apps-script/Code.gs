/**
 * =========================================================================
 * SERVCALC DEV DASHBOARD — Google Apps Script Backend
 * =========================================================================
 * 
 * INSTRUÇÕES:
 * 1. Abra o script vinculado à sua planilha (sheets.google.com).
 * 2. Substitua todo o conteúdo de Code.gs por este arquivo e salve (Ctrl+S).
 * 3. Clique em "Implantar" (Deploy) -> "Gerenciar implantações" (Manage deployments).
 * 4. Clique no ícone de lápis (Editar) -> Versão: "Nova versão" -> Clique em "Implantar".
 * 
 * ENDPOINTS:
 * - GET  ?action=getDoc&docId=XXX  -> Retorna HTML do documento Google Docs
 * - GET  ?action=getTasks          -> Retorna estados das tarefas (TaskState)
 * - GET  ?action=getCustomTasks    -> Retorna tarefas criadas dinamicamente
 * - GET  ?action=getLog            -> Retorna últimos 50 logs
 * - GET  ?action=setup             -> Cria abas necessárias automaticamente
 * - POST action=updateTask         -> Atualiza estado de 1 tarefa
 * - POST action=updateTasks        -> Atualiza estados em lote
 * - POST action=addTask            -> Adiciona uma nova tarefa dinâmica
 * - POST action=sendEmail          -> Envia email de prioridades via Google Mail
 */

const ALLOWED_ORIGIN = "https://lordwaker.github.io";

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  try {
    let action = e.parameter ? e.parameter.action : null;
    
    // Tratamento para requisições POST com payload no body
    let body = {};
    if (method === 'POST' && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch(err) {
        body = {};
      }
      if (!action && body.action) {
        action = body.action;
      }
    }

    let result = { success: false, message: "Ação não reconhecida ou ausente." };

    if (method === 'GET') {
      if (action === 'getDoc') {
        result = getDocContent(e.parameter.docId);
      } else if (action === 'getTasks') {
        result = getTasks();
      } else if (action === 'getCustomTasks') {
        result = getCustomTasks();
      } else if (action === 'getLog') {
        result = getLog();
      } else if (action === 'setup') {
        result = setupSheets();
      }
    } else if (method === 'POST') {
      if (action === 'updateTask') {
        result = updateTask(body);
      } else if (action === 'updateTasks') {
        result = updateTasks(body);
      } else if (action === 'addTask') {
        result = addCustomTask(body);
      } else if (action === 'sendEmail') {
        result = sendEmail(body);
      }
    }

    return createJsonResponse(result);
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

// Cria a resposta JSON para o cliente
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 1. GET ?action=getDoc&docId=XXX
function getDocContent(docId) {
  if (!docId) return { success: false, message: "Parâmetro docId ausente." };
  
  try {
    DriveApp.getFiles(); // Garante permissão do Drive
    
    const url = "https://docs.google.com/feeds/download/documents/export/Export?id=" + docId + "&exportFormat=html";
    const param = {
      method: "get",
      headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, param);
    const html = response.getContentText();
    
    if (response.getResponseCode() !== 200) {
       return { success: false, message: "Falha ao exportar documento.", details: html };
    }
    
    return { success: true, data: { html: html } };
  } catch (e) {
    return { success: false, message: "Erro ao ler o documento: " + e.toString() };
  }
}

// 2. GET ?action=getTasks
function getTasks() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return { success: false, message: "Script não está vinculado a uma planilha." };
  
  const sheet = ss.getSheetByName('TaskState');
  if (!sheet) return { success: false, message: "Aba 'TaskState' não encontrada. Execute ?action=setup." };
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] }; // Apenas cabeçalho
  
  const tasks = [];
  for (let i = 1; i < data.length; i++) {
    tasks.push({
      taskId: String(data[i][0]),
      done: data[i][1] === true || data[i][1] === 'TRUE',
      updatedBy: data[i][2],
      updatedAt: data[i][3]
    });
  }
  return { success: true, data: tasks };
}

// 3. POST action=updateTask
function updateTask(body) {
  const { taskId, done, updatedBy } = body;
  if (!taskId) return { success: false, message: "taskId ausente no body da requisição." };
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('TaskState');
  if (!sheet) return { success: false, message: "Aba 'TaskState' não encontrada." };
  
  const data = sheet.getDataRange().getValues();
  let foundIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(taskId)) {
      foundIndex = i + 1; // 1-indexed para getRange
      break;
    }
  }
  
  const now = new Date();
  
  if (foundIndex !== -1) {
    sheet.getRange(foundIndex, 2, 1, 3).setValues([[done, updatedBy, now]]);
  } else {
    sheet.appendRow([taskId, done, updatedBy, now]);
  }
  
  logAction(taskId, "updateTask (done: " + done + ")", updatedBy);
  
  return { success: true, message: "Tarefa atualizada com sucesso." };
}

// 4. POST action=updateTasks
function updateTasks(body) {
  const tasks = body.tasks;
  if (!tasks || !Array.isArray(tasks)) {
    return { success: false, message: "Lista de tarefas ausente ou inválida." };
  }
  
  for (let task of tasks) {
    updateTask(task);
  }
  
  return { success: true, message: tasks.length + " tarefas processadas em lote." };
}

// 5. POST action=addTask (Cria nova tarefa personalizada)
function addCustomTask(body) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return { success: false, message: "Planilha não encontrada." };
  
  let sheet = ss.getSheetByName('CustomTasks');
  if (!sheet) {
    sheet = ss.insertSheet('CustomTasks');
    sheet.appendRow(['id', 'sprint', 'date', 'text', 'tags', 'hours', 'created_by', 'created_at']);
    sheet.getRange('A1:H1').setFontWeight('bold');
  }
  
  const now = new Date();
  const id = 'custom-' + now.getTime();
  const sprint = parseInt(body.sprint) || 1;
  const dateStr = body.date || Utilities.formatDate(now, 'GMT-3', 'yyyy-MM-dd');
  const text = body.text || 'Nova Tarefa';
  const tagsStr = Array.isArray(body.tags) ? body.tags.join(',') : (body.tags || 'feedback');
  const hours = body.hours || '1h';
  const createdBy = body.createdBy || 'Thiago';
  
  sheet.appendRow([id, sprint, dateStr, text, tagsStr, hours, createdBy, now]);
  logAction(id, "addTask: " + text, createdBy);
  
  return {
    success: true,
    data: {
      id: id,
      sprint: sprint,
      date: dateStr,
      text: text,
      tags: tagsStr.split(','),
      hours: hours,
      createdBy: createdBy,
      isCustom: true
    }
  };
}

// 6. GET ?action=getCustomTasks
function getCustomTasks() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return { success: true, data: [] };
  
  const sheet = ss.getSheetByName('CustomTasks');
  if (!sheet) return { success: true, data: [] };
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] };
  
  const tasks = [];
  for (let i = 1; i < data.length; i++) {
    const rawDate = data[i][2];
    let dateStr = '';
    if (rawDate instanceof Date) {
      dateStr = Utilities.formatDate(rawDate, 'GMT-3', 'yyyy-MM-dd');
    } else {
      dateStr = String(rawDate);
    }
    
    tasks.push({
      id: String(data[i][0]),
      sprint: parseInt(data[i][1]) || 1,
      date: dateStr,
      text: String(data[i][3]),
      tags: data[i][4] ? String(data[i][4]).split(',') : ['feedback'],
      hours: String(data[i][5] || '1h'),
      createdBy: String(data[i][6] || ''),
      isCustom: true
    });
  }
  return { success: true, data: tasks };
}

// 7. POST action=sendEmail (Envia resumo de prioridades por email)
function sendEmail(body) {
  try {
    const to = body.to || 'thiago.ferreira@servcalc.com.br';
    const subject = body.subject || ('📅 Prioridades do Dia — ServCalc (' + Utilities.formatDate(new Date(), 'GMT-3', 'dd/MM/yyyy') + ')');
    const htmlBody = body.html || '';
    const plainBody = body.text || 'Resumo de prioridades do ServCalc';
    
    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: htmlBody,
      body: plainBody
    });
    
    logAction('EMAIL', 'Email enviado para ' + to, body.sender || 'Sistema');
    return { success: true, message: 'Email enviado com sucesso para ' + to };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

// 8. GET ?action=getLog
function getLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Log');
  if (!sheet) return { success: false, message: "Aba 'Log' não encontrada." };
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] };
  
  const logs = [];
  const startIndex = Math.max(1, data.length - 50);
  for (let i = data.length - 1; i >= startIndex; i--) {
    logs.push({
      timestamp: data[i][0],
      taskId: data[i][1],
      action: data[i][2],
      user: data[i][3]
    });
  }
  return { success: true, data: logs };
}

// Função auxiliar para inserir logs
function logAction(taskId, action, user) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Log');
    if (sheet) {
      sheet.appendRow([new Date(), taskId, action, user || 'Sistema']);
    }
  } catch(e) {}
}

// 9. GET ?action=setup
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return { success: false, message: "Script não está vinculado a uma planilha." };
  
  let taskSheet = ss.getSheetByName('TaskState');
  let customSheet = ss.getSheetByName('CustomTasks');
  let logSheet = ss.getSheetByName('Log');
  let actions = [];
  
  if (!taskSheet) {
    taskSheet = ss.insertSheet('TaskState');
    taskSheet.appendRow(['task_id', 'done', 'updated_by', 'updated_at']);
    taskSheet.getRange('A1:D1').setFontWeight('bold');
    actions.push("Aba 'TaskState' criada.");
  } else {
    actions.push("Aba 'TaskState' já existe.");
  }
  
  if (!customSheet) {
    customSheet = ss.insertSheet('CustomTasks');
    customSheet.appendRow(['id', 'sprint', 'date', 'text', 'tags', 'hours', 'created_by', 'created_at']);
    customSheet.getRange('A1:H1').setFontWeight('bold');
    actions.push("Aba 'CustomTasks' criada.");
  } else {
    actions.push("Aba 'CustomTasks' já existe.");
  }
  
  if (!logSheet) {
    logSheet = ss.insertSheet('Log');
    logSheet.appendRow(['timestamp', 'task_id', 'action', 'user']);
    logSheet.getRange('A1:D1').setFontWeight('bold');
    actions.push("Aba 'Log' criada.");
  } else {
    actions.push("Aba 'Log' já existe.");
  }
  
  return { success: true, message: "Setup finalizado com sucesso.", details: actions };
}
