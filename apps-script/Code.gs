/**
 * INSTRUÇÕES:
 * 1. Crie um novo projeto no Google Apps Script (script.google.com) vinculado a uma Planilha (Google Sheets).
 * 2. Cole este código no arquivo Code.gs (substituindo o conteúdo padrão).
 * 3. Clique em "Implantar" (Deploy) -> "Nova implantação" (New deployment).
 * 4. Escolha "App da Web" (Web app).
 * 5. Executar como: "Eu" (Me).
 * 6. Quem tem acesso: "Qualquer pessoa" (Anyone).
 * 7. Clique em "Implantar" (Deploy) e aceite as permissões. Você receberá um URL da Web App.
 * 8. Acesse a URL adicionando "?action=setup" no final para criar as abas necessárias na planilha ("TaskState" e "Log").
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
    let action = e.parameter.action;
    
    // Tratamento para requisições POST com payload no body
    let body = {};
    if (method === 'POST' && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
      // Se a action não estiver nos parâmetros da URL, pega do body
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
    // Isso garante que o script solicite permissão de leitura de arquivos no escopo OAuth.
    // DocumentApp.openById(docId); // Pode ser necessário dependendo do escopo, mas UrlFetchApp já precisa do token.
    DriveApp.getFiles(); // Hack para forçar a permissão do Drive na autorização
    
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
      taskId: data[i][0],
      done: data[i][1],
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
  // Procura pela tarefa na coluna A (índice 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == taskId) {
      foundIndex = i + 1; // getRange usa indexação baseada em 1
      break;
    }
  }
  
  const now = new Date();
  
  if (foundIndex !== -1) {
    // Atualiza a linha existente (colunas B, C, D)
    sheet.getRange(foundIndex, 2, 1, 3).setValues([[done, updatedBy, now]]);
  } else {
    // Adiciona uma nova linha
    sheet.appendRow([taskId, done, updatedBy, now]);
  }
  
  // Registra no Log
  logAction(taskId, \`updateTask (done: \${done})\`, updatedBy);
  
  return { success: true, message: "Tarefa atualizada com sucesso." };
}

// 4. POST action=updateTasks
function updateTasks(body) {
  const tasks = body.tasks;
  if (!tasks || !Array.isArray(tasks)) {
    return { success: false, message: "Lista de tarefas ausente ou inválida." };
  }
  
  // Loop para atualizar cada tarefa
  for (let task of tasks) {
    updateTask(task);
  }
  
  return { success: true, message: \`\${tasks.length} tarefas processadas em lote.\` };
}

// 5. GET ?action=getLog
function getLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Log');
  if (!sheet) return { success: false, message: "Aba 'Log' não encontrada." };
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] }; // Apenas cabeçalho
  
  const logs = [];
  // Retorna apenas os últimos 50 registros (do mais recente para o mais antigo)
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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Log');
  if (sheet) {
    sheet.appendRow([new Date(), taskId, action, user || 'Sistema']);
  }
}

// 6. GET ?action=setup
// Endpoint especial para criar as abas necessárias automaticamente
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return { success: false, message: "Script não está vinculado a uma planilha. Crie a partir de uma Planilha do Google." };
  
  let taskSheet = ss.getSheetByName('TaskState');
  let logSheet = ss.getSheetByName('Log');
  let actions = [];
  
  // Criação da aba TaskState
  if (!taskSheet) {
    taskSheet = ss.insertSheet('TaskState');
    taskSheet.appendRow(['task_id', 'done', 'updated_by', 'updated_at']);
    taskSheet.getRange('A1:D1').setFontWeight('bold');
    actions.push("Aba 'TaskState' criada com sucesso.");
  } else {
    actions.push("Aba 'TaskState' já existe.");
  }
  
  // Criação da aba Log
  if (!logSheet) {
    logSheet = ss.insertSheet('Log');
    logSheet.appendRow(['timestamp', 'task_id', 'action', 'user']);
    logSheet.getRange('A1:D1').setFontWeight('bold');
    actions.push("Aba 'Log' criada com sucesso.");
  } else {
    actions.push("Aba 'Log' já existe.");
  }
  
  return { success: true, message: "Setup finalizado.", details: actions };
}
