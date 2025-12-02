// Chat Premium - WebSocket/STOMP
// Usa conexao global do presenca.js

// Estado global
let stompClient = null;
let currentUser = null;
let currentConversaId = null;
let currentDestinatarioId = null;
let conversations = [];
let usersOnline = new Set();
let typingTimeout = null;
let originalTitle = document.title;
let chatSubscriptions = [];

// Elementos DOM
const premiumRequired = document.getElementById("premium-required");
const chatContainer = document.getElementById("chat-container");
const conversationsList = document.getElementById("conversations-list");
const usersList = document.getElementById("users-list");
const usersItems = document.getElementById("users-items");
const messagesContainer = document.getElementById("messages-container");
const chatHeader = document.getElementById("chat-header");
const chatAvatar = document.getElementById("chat-avatar");
const chatUserName = document.getElementById("chat-user-name");
const chatUserStatus = document.getElementById("chat-user-status");
const messageInput = document.getElementById("message-input");
const messageInputContainer = document.getElementById("message-input-container");
const btnSend = document.getElementById("btn-send");
const btnNewChat = document.getElementById("btn-new-chat");
const btnBackConversations = document.getElementById("btn-back-conversations");
const typingIndicator = document.getElementById("typing-indicator");
const typingUser = document.getElementById("typing-user");
const notificationSound = document.getElementById("notification-sound");

// Inicializacao
async function init() {
  const token = localStorage.getItem("userToken");

  if (!token) {
    window.location.href = "/views/login/index.html";
    return;
  }

  // Verificar se usuario e Premium
  try {
    const response = await fetch(`${BFF_BASE_URL}/bff/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
      window.location.href = "/views/login/index.html";
      return;
    }

    const result = await response.json();
    currentUser = result.data || result;

    if (!currentUser.premium) {
      premiumRequired.style.display = "block";
      chatContainer.style.display = "none";
      return;
    }

    // Usuario e Premium - mostrar chat
    premiumRequired.style.display = "none";
    chatContainer.style.display = "grid";

    // Carregar conversas
    await loadConversations();

    // Conectar ou usar conexao existente do WebSocket
    setupWebSocketConnection();

    // Setup eventos
    setupEventListeners();

  } catch (error) {
    console.error("Erro ao inicializar chat:", error);
    window.location.href = "/views/login/index.html";
  }
}

// Usar conexao global ou aguardar ela ficar pronta
function setupWebSocketConnection() {
  // Verificar se a conexao global ja existe e esta conectada
  if (window.presencaGlobal && window.presencaGlobal.isConnected()) {
    stompClient = window.presencaGlobal.getClient();
    setupChatSubscriptions();
    console.log("[Chat] Usando conexao global existente");
  } else {
    // Aguardar o evento de conexao do presenca.js
    window.addEventListener('presenca:online', () => {
      if (window.presencaGlobal) {
        stompClient = window.presencaGlobal.getClient();
        setupChatSubscriptions();
        console.log("[Chat] Conexao global disponivel");
      }
    }, { once: true });

    // Fallback: tentar a cada 500ms por 5 segundos
    let attempts = 0;
    const checkConnection = setInterval(() => {
      attempts++;
      if (window.presencaGlobal && window.presencaGlobal.isConnected()) {
        clearInterval(checkConnection);
        stompClient = window.presencaGlobal.getClient();
        setupChatSubscriptions();
        console.log("[Chat] Conexao global detectada");
      } else if (attempts >= 10) {
        clearInterval(checkConnection);
        console.warn("[Chat] Timeout aguardando conexao global");
      }
    }, 500);
  }

  // Escutar eventos de presenca do sistema global
  window.addEventListener('presenca:update', (e) => {
    handlePresenceEvent(e.detail);
  });
}

// Configurar subscricoes especificas do chat
function setupChatSubscriptions() {
  if (!stompClient || !stompClient.connected) {
    console.warn("[Chat] StompClient nao conectado");
    return;
  }

  // Subscrever a mensagens privadas
  const msgSub = stompClient.subscribe("/user/queue/mensagens", (message) => {
    const msg = JSON.parse(message.body);
    handleNewMessage(msg);
  });
  chatSubscriptions.push(msgSub);

  // Subscrever a indicador de digitando
  const typingSub = stompClient.subscribe("/user/queue/digitando", (message) => {
    const data = JSON.parse(message.body);
    handleTypingIndicator(data);
  });
  chatSubscriptions.push(typingSub);

  console.log("[Chat] Subscricoes configuradas");
}

// Carregar conversas do BFF
async function loadConversations() {
  const token = localStorage.getItem("userToken");

  try {
    const response = await fetch(`${BFF_BASE_URL}/bff/chat/conversas`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      const result = await response.json();
      conversations = result.data || [];
      renderConversations();
    }
  } catch (error) {
    console.error("Erro ao carregar conversas:", error);
  }
}

// Renderizar lista de conversas
function renderConversations() {
  if (conversations.length === 0) {
    conversationsList.innerHTML = '<p class="empty-state">Nenhuma conversa ainda</p>';
    return;
  }

  conversationsList.innerHTML = conversations.map(conv => `
    <div class="conversation-item ${conv.id === currentConversaId ? 'active' : ''}"
         data-id="${conv.id}"
         data-user-id="${conv.outroUsuarioId}"
         data-user-name="${conv.outroUsuarioNome}">
      <div class="conversation-avatar">
        ${conv.outroUsuarioAvatar
          ? `<img src="${conv.outroUsuarioAvatar}" alt="${conv.outroUsuarioNome}">`
          : conv.outroUsuarioNome.charAt(0).toUpperCase()}
        <span class="${conv.outroUsuarioOnline ? 'online-indicator' : 'online-indicator offline-indicator'}"></span>
      </div>
      <div class="conversation-info">
        <div class="conversation-name">
          ${conv.outroUsuarioNome}
          ${conv.mensagensNaoLidas > 0 ? `<span class="unread-badge">${conv.mensagensNaoLidas}</span>` : ''}
        </div>
        <div class="conversation-preview">${conv.ultimaMensagem || 'Iniciar conversa'}</div>
      </div>
      ${conv.ultimaMensagemAt ? `<span class="conversation-time">${formatTime(conv.ultimaMensagemAt)}</span>` : ''}
    </div>
  `).join('');

  // Adicionar eventos de clique
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.addEventListener('click', () => {
      const conversaId = parseInt(item.dataset.id);
      const userId = parseInt(item.dataset.userId);
      const userName = item.dataset.userName;
      openConversation(conversaId, userId, userName);
    });
  });
}

// Abrir conversa
async function openConversation(conversaId, userId, userName) {
  currentConversaId = conversaId;
  currentDestinatarioId = userId;

  // Resetar estado de digitando ao trocar de conversa
  savedUserStatus = null;
  typingIndicator.style.display = "none";

  // Atualizar UI
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.classList.toggle('active', parseInt(item.dataset.id) === conversaId);
  });

  // Mostrar header e input
  chatHeader.style.display = "block";
  messageInputContainer.style.display = "flex";

  // Atualizar header
  const conv = conversations.find(c => c.id === conversaId);
  chatUserName.textContent = userName;
  chatUserStatus.textContent = conv?.outroUsuarioOnline ? "Online" : "Offline";
  chatUserStatus.className = `user-status ${conv?.outroUsuarioOnline ? 'online' : ''}`;

  if (conv?.outroUsuarioAvatar) {
    chatAvatar.innerHTML = `<img src="${conv.outroUsuarioAvatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
  } else {
    chatAvatar.textContent = userName.charAt(0).toUpperCase();
  }

  // Carregar mensagens
  await loadMessages(conversaId);

  // Marcar como lidas
  markAsRead(conversaId);

  // Focar no input
  messageInput.focus();
}

// Carregar mensagens de uma conversa
async function loadMessages(conversaId) {
  const token = localStorage.getItem("userToken");

  try {
    const response = await fetch(`${BFF_BASE_URL}/bff/chat/conversas/${conversaId}/mensagens`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      const result = await response.json();
      const messages = result.data || [];
      renderMessages(messages.reverse()); // Inverter para ordem cronologica
    }
  } catch (error) {
    console.error("Erro ao carregar mensagens:", error);
  }
}

// Renderizar mensagens
function renderMessages(messages) {
  if (messages.length === 0) {
    messagesContainer.innerHTML = `
      <div class="empty-chat">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <p>Envie a primeira mensagem!</p>
      </div>
    `;
    return;
  }

  messagesContainer.innerHTML = messages.map(msg => `
    <div class="message ${msg.remetenteId === currentUser.id ? 'sent' : 'received'}">
      <div class="message-content">${escapeHtml(msg.conteudo)}</div>
      <div class="message-time">${formatTime(msg.createdAt)}</div>
    </div>
  `).join('');

  // Scroll para o final
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Enviar mensagem
function sendMessage() {
  const content = messageInput.value.trim();
  if (!content || !currentDestinatarioId || !stompClient?.connected) return;

  // Adicionar mensagem na tela imediatamente (otimistic update)
  const messageDiv = document.createElement("div");
  messageDiv.className = "message sent";
  messageDiv.innerHTML = `
    <div class="message-content">${escapeHtml(content)}</div>
    <div class="message-time">${formatTime(new Date().toISOString())}</div>
  `;

  // Remover empty-chat se existir
  const emptyChat = messagesContainer.querySelector('.empty-chat');
  if (emptyChat) emptyChat.remove();

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Enviar via WebSocket
  stompClient.publish({
    destination: "/app/chat.enviar",
    body: JSON.stringify({
      destinatarioId: currentDestinatarioId,
      conteudo: content
    })
  });

  messageInput.value = "";
}

// Handler para nova mensagem recebida
function handleNewMessage(msg) {
  // Ignorar mensagens que eu mesmo enviei (já foram adicionadas no sendMessage)
  if (msg.remetenteId === currentUser.id) {
    // Apenas atualizar lista de conversas para refletir a última mensagem
    loadConversations();
    return;
  }

  // Se é da conversa atual, adicionar na tela
  if (msg.conversaId === currentConversaId) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message received";
    messageDiv.innerHTML = `
      <div class="message-content">${escapeHtml(msg.conteudo)}</div>
      <div class="message-time">${formatTime(msg.createdAt)}</div>
    `;

    // Remover empty-chat se existir
    const emptyChat = messagesContainer.querySelector('.empty-chat');
    if (emptyChat) emptyChat.remove();

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Marcar como lida
    markAsRead(currentConversaId);
  } else {
    // Mensagem de outra conversa - notificar com toast
    showToastNotification(msg);
    playNotificationSound();
    updateTitleWithUnread();
  }

  // Atualizar lista de conversas
  loadConversations();
}

// Handler para indicador de digitando
let savedUserStatus = null; // Guardar status original para restaurar
let savedConversationPreviews = {}; // Guardar preview original das conversas

function handleTypingIndicator(data) {
  // Atualizar preview na lista de conversas (sidebar)
  const conversationItem = document.querySelector(`.conversation-item[data-id="${data.conversaId}"]`);
  if (conversationItem) {
    const previewElement = conversationItem.querySelector('.conversation-preview');
    if (previewElement) {
      if (data.digitando) {
        // Salvar preview original se ainda não salvou
        if (!savedConversationPreviews[data.conversaId]) {
          savedConversationPreviews[data.conversaId] = previewElement.innerHTML;
        }
        previewElement.innerHTML = '<span class="typing-preview">digitando...</span>';
      } else {
        // Restaurar preview original
        if (savedConversationPreviews[data.conversaId]) {
          previewElement.innerHTML = savedConversationPreviews[data.conversaId];
          delete savedConversationPreviews[data.conversaId];
        }
      }
    }
  }

  // Atualizar header e indicador se for a conversa atual
  if (data.conversaId === currentConversaId) {
    if (data.digitando) {
      // Mostrar indicador de digitando no rodapé
      typingUser.textContent = data.usuarioNome;
      typingIndicator.style.display = "flex";

      // Atualizar status no header (estilo WhatsApp)
      if (!savedUserStatus) {
        savedUserStatus = {
          text: chatUserStatus.textContent,
          className: chatUserStatus.className
        };
      }
      chatUserStatus.textContent = "digitando...";
      chatUserStatus.className = "user-status online";
    } else {
      // Esconder indicador de digitando
      typingIndicator.style.display = "none";

      // Restaurar status original no header
      if (savedUserStatus) {
        chatUserStatus.textContent = savedUserStatus.text;
        chatUserStatus.className = savedUserStatus.className;
        savedUserStatus = null;
      }
    }
  }
}

// Handler para eventos de presenca
function handlePresenceEvent(event) {
  if (event.online) {
    usersOnline.add(event.clienteId);
  } else {
    usersOnline.delete(event.clienteId);
  }

  // Atualizar status na conversa atual
  if (currentDestinatarioId === event.clienteId) {
    chatUserStatus.textContent = event.online ? "Online" : "Offline";
    chatUserStatus.className = `user-status ${event.online ? 'online' : ''}`;
  }

  // Atualizar lista de conversas
  conversations = conversations.map(conv => {
    if (conv.outroUsuarioId === event.clienteId) {
      return { ...conv, outroUsuarioOnline: event.online };
    }
    return conv;
  });
  renderConversations();
}

// Notificar que esta digitando
function notifyTyping() {
  if (!currentConversaId || !stompClient?.connected) return;

  stompClient.publish({
    destination: "/app/chat.digitando",
    body: JSON.stringify({
      conversaId: currentConversaId,
      digitando: true
    })
  });

  // Parar de notificar apos 2 segundos
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    if (stompClient?.connected) {
      stompClient.publish({
        destination: "/app/chat.digitando",
        body: JSON.stringify({
          conversaId: currentConversaId,
          digitando: false
        })
      });
    }
  }, 2000);
}

// Marcar mensagens como lidas
async function markAsRead(conversaId) {
  const token = localStorage.getItem("userToken");

  try {
    await fetch(`${BFF_BASE_URL}/bff/chat/conversas/${conversaId}/lidas`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
  } catch (error) {
    console.error("Erro ao marcar como lidas:", error);
  }
}

// Carregar lista de usuarios Premium
async function loadUsers() {
  const token = localStorage.getItem("userToken");

  try {
    const response = await fetch(`${BFF_BASE_URL}/bff/chat/usuarios`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      const result = await response.json();
      const users = result.data || [];
      renderUsers(users);
    }
  } catch (error) {
    console.error("Erro ao carregar usuarios:", error);
  }
}

// Renderizar lista de usuarios
function renderUsers(users) {
  if (users.length === 0) {
    usersItems.innerHTML = '<p class="empty-state">Nenhum usuario encontrado</p>';
    return;
  }

  usersItems.innerHTML = users.map(user => `
    <div class="user-item" data-id="${user.clienteId}" data-name="${user.nome}">
      <div class="conversation-avatar">
        ${user.avatarDataUrl
          ? `<img src="${user.avatarDataUrl}" alt="${user.nome}">`
          : user.nome.charAt(0).toUpperCase()}
        <span class="${user.connectedAt ? 'online-indicator' : 'online-indicator offline-indicator'}"></span>
      </div>
      <div class="conversation-info">
        <div class="conversation-name">${user.nome}</div>
        <div class="conversation-preview">@${user.username}</div>
      </div>
    </div>
  `).join('');

  // Adicionar eventos de clique
  document.querySelectorAll('.user-item').forEach(item => {
    item.addEventListener('click', async () => {
      const userId = parseInt(item.dataset.id);
      await startConversation(userId);
    });
  });
}

// Iniciar nova conversa
async function startConversation(userId) {
  const token = localStorage.getItem("userToken");

  try {
    const response = await fetch(`${BFF_BASE_URL}/bff/chat/conversas/iniciar/${userId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      const result = await response.json();
      const conversa = result.data;

      // Voltar para lista de conversas
      showConversations();

      // Recarregar conversas
      await loadConversations();

      // Abrir a conversa
      openConversation(conversa.id, conversa.outroUsuarioId, conversa.outroUsuarioNome);
    }
  } catch (error) {
    console.error("Erro ao iniciar conversa:", error);
  }
}

// Mostrar lista de usuarios
function showUsers() {
  conversationsList.style.display = "none";
  usersList.style.display = "flex";
  loadUsers();
}

// Mostrar lista de conversas
function showConversations() {
  conversationsList.style.display = "block";
  usersList.style.display = "none";
}

// Setup event listeners
function setupEventListeners() {
  // Enviar mensagem
  btnSend.addEventListener("click", sendMessage);
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Digitando
  messageInput.addEventListener("input", notifyTyping);

  // Nova conversa
  btnNewChat.addEventListener("click", showUsers);
  btnBackConversations.addEventListener("click", showConversations);

  // Visibilidade da pagina
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      document.title = originalTitle;
    }
  });
}

// Utilitarios
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } else if (days === 1) {
    return "Ontem";
  } else if (days < 7) {
    return date.toLocaleDateString("pt-BR", { weekday: "short" });
  } else {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function playNotificationSound() {
  if (notificationSound) {
    notificationSound.currentTime = 0;
    notificationSound.play().catch(() => {});
  }
}

function updateTitleWithUnread() {
  if (document.hidden) {
    document.title = "(Nova mensagem) " + originalTitle;
  }
}

// Toast Notification - Estilo WhatsApp
function showToastNotification(msg) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  // Buscar info do remetente na lista de conversas
  const conv = conversations.find(c => c.id === msg.conversaId);
  const senderName = conv?.outroUsuarioNome || 'Novo';
  const senderAvatar = conv?.outroUsuarioAvatar;
  const senderInitial = senderName.charAt(0).toUpperCase();

  // Criar elemento toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-avatar">
      ${senderAvatar ? `<img src="${senderAvatar}" alt="${senderName}">` : senderInitial}
    </div>
    <div class="toast-content">
      <div class="toast-header">
        <span class="toast-sender">${escapeHtml(senderName)}</span>
        <span class="toast-time">Agora</span>
      </div>
      <div class="toast-message">${escapeHtml(msg.conteudo)}</div>
    </div>
    <button class="toast-close">&times;</button>
  `;

  // Click para abrir conversa
  toast.addEventListener('click', (e) => {
    if (!e.target.classList.contains('toast-close')) {
      if (conv) {
        openConversation(conv.id, conv.outroUsuarioId, conv.outroUsuarioNome);
      }
      removeToast(toast);
    }
  });

  // Botao fechar
  toast.querySelector('.toast-close').addEventListener('click', (e) => {
    e.stopPropagation();
    removeToast(toast);
  });

  // Adicionar ao container
  toastContainer.appendChild(toast);

  // Auto-remover apos 5 segundos
  setTimeout(() => {
    removeToast(toast);
  }, 5000);

  // Limitar a 3 toasts
  const toasts = toastContainer.querySelectorAll('.toast');
  if (toasts.length > 3) {
    removeToast(toasts[0]);
  }
}

function removeToast(toast) {
  if (!toast || !toast.parentNode) return;
  toast.classList.add('toast-exit');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

// Iniciar
init();
