# 📅 ServCalc Dev Dashboard

Dashboard interativo de desenvolvimento do ServCalc com sincronização em tempo real via Google Sheets, leitura do documento de melhorias do Google Drive, painel de prioridades do dia, e envio automático de resumo por email via **OCI Email Delivery**.

## 🚀 Acesso

**URL:** `https://lordwaker.github.io/scalc-dashboard`

---

## 📋 Setup — Passo a Passo

### 1. Google Sheet (Banco de dados gratuito)

O Google Sheet funciona como banco de dados para o estado das tasks (quem marcou, quando, etc.). Qualquer pessoa que abrir o dashboard vê o mesmo estado.

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma nova planilha
2. Renomeie para **"ServCalc Dashboard Estado"**
3. No menu superior: **Extensões → Apps Script**
4. Delete o conteúdo padrão e cole o conteúdo do arquivo `apps-script/Code.gs`
5. Clique em **Implantar → Nova implantação**
6. Selecione tipo: **App da Web**
7. Configurações:
   - **Executar como:** Eu
   - **Quem tem acesso:** Qualquer pessoa
8. Clique em **Implantar** e aceite as permissões
9. **Copie a URL** gerada (algo como `https://script.google.com/macros/s/XXXXX/exec`)
10. Acesse `URL_COPIADA?action=setup` no navegador para criar as abas automaticamente

### 2. Google Doc (Documento de melhorias)

O dashboard exibe o conteúdo do documento de melhorias inline para referência rápida.

1. Abra o documento de melhorias no Google Drive
2. Clique em **Compartilhar → Qualquer pessoa com o link pode visualizar**
3. O dashboard vai puxar o conteúdo automaticamente via Apps Script

### 3. Email de Prioridades (OCI Email Delivery)

O email de prioridades é enviado pelo backend do ServCalc usando o **OCI Email Delivery SMTP** que já está configurado. Não precisa de nenhum serviço externo.

**O que já está pronto:**
- Endpoint `POST /api/dashboard/send-priority-email` adicionado ao backend
- Usa o mesmo transporter SMTP OCI do `authController.js`
- Protegido por chave API no header `x-dashboard-key`

**Variáveis de ambiente adicionadas ao `.env` do backend:**
```env
# Dashboard de Desenvolvimento
DASHBOARD_API_KEY=scalc-dash-2026-prioridades
OCI_EMAIL_FROM=noreply@servcalc.com.br
CORS_ORIGINS=https://servcalc.com.br,https://www.servcalc.com.br,https://lordwaker.github.io
```

**Após fazer deploy do backend com as novas alterações**, o email de prioridades será enviado:
- **Automaticamente** às 18:30 quando o dashboard estiver aberto
- **Manualmente** clicando no botão 📧 no dashboard

### 4. Configurar no Dashboard

1. Abra o dashboard no navegador
2. Clique em **⚙️** (barra de sync, canto direito)
3. Preencha:
   - **Google Apps Script URL** → URL do passo 1.9
   - **ServCalc API URL** → `https://servcalc.com.br/api`
   - **Dashboard API Key** → `scalc-dash-2026-prioridades`
4. Clique em **💾 Salvar**

### 5. Publicar no GitHub Pages

```bash
# Abra o terminal na pasta do projeto
cd d:\Backup\Scalc\scalc-dashboard

# Inicialize o repositório
git init
git add .
git commit -m "Dashboard ServCalc v1"

# Conecte ao GitHub (o repositório deve existir no GitHub)
# Acesse https://github.com/new e crie o repo "scalc-dashboard"
git remote add origin https://github.com/Lordwaker/scalc-dashboard.git
git branch -M main
git push -u origin main
```

**Depois de fazer o push:**
1. Acesse `https://github.com/Lordwaker/scalc-dashboard/settings/pages`
2. Em **Source**, selecione **Deploy from a branch**
3. Em **Branch**, selecione `main` e pasta `/ (root)`
4. Clique em **Save**
5. Aguarde ~2 minutos → O site estará em `https://lordwaker.github.io/scalc-dashboard`

---

## 🏗️ Estrutura do Projeto

```
scalc-dashboard/
├── index.html                    # Dashboard principal
├── css/
│   └── styles.css                # Design system dark mode premium
├── js/
│   ├── config.js                 # Configurações (API URLs, chaves)
│   ├── data.js                   # 68 tasks, 4 sprints, milestones
│   ├── google-sync.js            # Sync estado via Google Sheets
│   ├── priorities.js             # Engine de prioridades do dia
│   ├── notifications.js          # Email via OCI (backend ServCalc)
│   └── app.js                    # Lógica principal do dashboard
├── apps-script/
│   └── Code.gs                   # Backend Google Apps Script
└── README.md

Alterações no backend ServCalc:
├── backend/src/controllers/
│   └── dashboardController.js    # [NOVO] Endpoint de email OCI
├── backend/src/routes/
│   └── dashboardRoutes.js        # [NOVO] Rota /api/dashboard
├── backend/src/app.js            # [MODIFICADO] Registro da rota
└── backend/.env                  # [MODIFICADO] +3 variáveis
```

---

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| 🎯 **Prioridades do Dia** | Card no topo com tasks de hoje + atrasadas, ordenadas por urgência |
| 📄 **Doc de Melhorias** | Conteúdo do Google Doc exibido inline no dashboard |
| 🔄 **Sync Compartilhada** | Google Sheet como banco — auto-refresh 30s |
| 📧 **Email 18:30** | Resumo de prioridades via **OCI Email Delivery** |
| 🏃 **4 Sprints** | Sprint 0 (Homolog) → Sprint 3 (Polimento) com barras de progresso |
| 🏷️ **8 Filtros** | Status + categorias (bug, segurança, feedback, etc.) |
| 🔔 **Notificações** | Browser notifications + toasts ao marcar/desmarcar tasks |
| 📱 **Responsivo** | Desktop e mobile |
| 👥 **Multi-usuário** | Qualquer pessoa com o link vê o estado atualizado |
| ⚙️ **Config UI** | Botão ⚙️ para configurar sem editar código |

---

## 💰 Custos

| Serviço | Uso | Custo |
|---|---|---|
| GitHub Pages | Hospedagem estática | **Grátis** |
| Google Sheets | Banco de dados de estado | **Grátis** |
| Google Apps Script | Backend/proxy para Doc e Sheet | **Grátis** |
| OCI Email Delivery | SMTP para emails de prioridade | **Já incluso na infra** |
| **Total** | | **R$ 0,00/mês adicional** |

---

## 🔧 Deploy do Backend

Após as alterações, faça o deploy normal do backend:

```bash
# Se usa deploy_homolog.py:
python deploy_homolog.py

# Após validar em homolog:
python deploy.py
```

**Arquivos novos no backend:**
- `src/controllers/dashboardController.js`
- `src/routes/dashboardRoutes.js`

**Arquivos modificados:**
- `src/app.js` — adicionado `require('./routes/dashboardRoutes')` e registro da rota
- `.env` — adicionadas 3 variáveis: `DASHBOARD_API_KEY`, `OCI_EMAIL_FROM`, `CORS_ORIGINS`
