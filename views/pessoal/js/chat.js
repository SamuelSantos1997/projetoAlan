// Chat Premium - WebSocket/STOMP
// URLs vem do config.js (importado no HTML)

// Estado global
let stompClient = null;
let currentUser = null;
let currentConversaId = null;
let currentDestinatarioId = null;
let conversations = [];
let usersOnline = new Set();
let typingTimeout = null;
let originalTitle = document.title;

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

// Inicialização
async function init() {
  const token = localStorage.getItem("userToken");

  if (!token) {
    window.location.href = "/views/login/index.html";
    return;
  }

  // Verificar se usuário é Premium
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

    // Usuário é Premium - mostrar chat
    premiumRequired.style.display = "none";
    chatContainer.style.display = "grid";

    // Carregar conversas
    await loadConversations();

    // Conectar WebSocket
    connectWebSocket(token);

    // Setup eventos
    setupEventListeners();

  } catch (error) {
    console.error("Erro ao inicializar chat:", error);
    window.location.href = "/views/login/index.html";
  }
}

// Conectar WebSocket/STOMP
function connectWebSocket(token) {
  const socket = new SockJS(`${WS_URL}?token=${token}`);

  stompClient = new StompJs.Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => console.log("[STOMP]", str)
  });

  stompClient.onConnect = () => {
    console.log("WebSocket conectado!");

    // Subscrever a mensagens privadas
    stompClient.subscribe("/user/queue/mensagens", (message) => {
      const msg = JSON.parse(message.body);
      handleNewMessage(msg);
    });

    // Subscrever a indicador de digitando
    stompClient.subscribe("/user/queue/digitando", (message) => {
      const data = JSON.parse(message.body);
      handleTypingIndicator(data);
    });

    // Subscrever a eventos de presença
    stompClient.subscribe("/topic/presenca", (message) => {
      const event = JSON.parse(message.body);
      handlePresenceEvent(event);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error("Erro STOMP:", frame.headers["message"], frame.body);
  };

  stompClient.onDisconnect = () => {
    console.log("WebSocket desconectado");
  };

  stompClient.activate();
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
      renderMessages(messages.reverse()); // Inverter para ordem cronológica
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
  // Se é da conversa atual, adicionar na tela
  if (msg.conversaId === currentConversaId) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${msg.remetenteId === currentUser.id ? 'sent' : 'received'}`;
    messageDiv.innerHTML = `
      <div class="message-content">${escapeHtml(msg.conteudo)}</div>
      <div class="message-time">${formatTime(msg.createdAt)}</div>
    `;

    // Remover empty-chat se existir
    const emptyChat = messagesContainer.querySelector('.empty-chat');
    if (emptyChat) emptyChat.remove();

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Marcar como lida se for mensagem recebida
    if (msg.remetenteId !== currentUser.id) {
      markAsRead(currentConversaId);
    }
  } else {
    // Mensagem de outra conversa - notificar
    playNotificationSound();
    updateTitleWithUnread();
  }

  // Atualizar lista de conversas
  loadConversations();
}

// Handler para indicador de digitando
function handleTypingIndicator(data) {
  if (data.conversaId === currentConversaId) {
    if (data.digitando) {
      typingUser.textContent = data.usuarioNome;
      typingIndicator.style.display = "block";
    } else {
      typingIndicator.style.display = "none";
    }
  }
}

// Handler para eventos de presença
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

// Notificar que está digitando
function notifyTyping() {
  if (!currentConversaId || !stompClient?.connected) return;

  stompClient.publish({
    destination: "/app/chat.digitando",
    body: JSON.stringify({
      conversaId: currentConversaId,
      digitando: true
    })
  });

  // Parar de notificar após 2 segundos
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    stompClient.publish({
      destination: "/app/chat.digitando",
      body: JSON.stringify({
        conversaId: currentConversaId,
        digitando: false
      })
    });
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

// Carregar lista de usuários Premium
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
    console.error("Erro ao carregar usuários:", error);
  }
}

// Renderizar lista de usuários
function renderUsers(users) {
  if (users.length === 0) {
    usersItems.innerHTML = '<p class="empty-state">Nenhum usuário encontrado</p>';
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

// Mostrar lista de usuários
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

  // Visibilidade da página
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      document.title = originalTitle;
    }
  });
}

// Utilitários
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

// Iniciar
init();
