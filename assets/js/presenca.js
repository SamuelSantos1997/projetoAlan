// ============================================
// SISTEMA DE PRESENCA GLOBAL
// Conecta ao WebSocket para manter status online
// Carregue este script em todas as paginas autenticadas
// ============================================

(function() {
  'use strict';

  // Evitar multiplas conexoes
  if (window.presencaGlobal) return;

  let stompClient = null;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Inicializar conexao de presenca
  function initPresenca() {
    // Verificar se as dependencias estao carregadas
    if (typeof BFF_BASE_URL === 'undefined' || typeof WS_URL === 'undefined') {
      console.log("[Presenca] Aguardando config.js...");
      setTimeout(initPresenca, 100);
      return;
    }

    if (typeof SockJS === 'undefined' || typeof StompJs === 'undefined') {
      console.log("[Presenca] Aguardando SockJS/STOMP...");
      setTimeout(initPresenca, 100);
      return;
    }

    const token = localStorage.getItem("userToken");

    if (!token) {
      console.log("[Presenca] Usuario nao autenticado");
      return;
    }

    // Verificar se o usuario e Premium antes de conectar
    verificarPremiumEConectar(token);
  }

  async function verificarPremiumEConectar(token) {
    try {
      const response = await fetch(`${BFF_BASE_URL}/bff/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        console.log("[Presenca] Token invalido");
        return;
      }

      const result = await response.json();
      const user = result.data || result;

      if (!user.premium) {
        console.log("[Presenca] Usuario nao e Premium - WebSocket nao necessario");
        return;
      }

      // Usuario Premium - conectar WebSocket
      conectarWebSocket(token);

    } catch (error) {
      console.error("[Presenca] Erro ao verificar usuario:", error);
    }
  }

  function conectarWebSocket(token) {
    if (stompClient && stompClient.connected) {
      console.log("[Presenca] Ja conectado");
      return;
    }

    console.log("[Presenca] Conectando WebSocket...");

    const socket = new SockJS(`${WS_URL}?token=${token}`);

    stompClient = new StompJs.Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: () => {} // Silencioso
    });

    stompClient.onConnect = () => {
      console.log("[Presenca] Conectado - Usuario online!");
      reconnectAttempts = 0;

      // Disparar evento customizado para outras partes da aplicacao
      window.dispatchEvent(new CustomEvent('presenca:online'));

      // Subscrever a eventos de presenca (opcional - para debug)
      stompClient.subscribe("/topic/presenca", (message) => {
        const event = JSON.parse(message.body);
        console.log("[Presenca] Evento:", event.online ? "conectou" : "desconectou", event.nome);
        window.dispatchEvent(new CustomEvent('presenca:update', { detail: event }));
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("[Presenca] Erro STOMP:", frame.headers["message"]);
    };

    stompClient.onDisconnect = () => {
      console.log("[Presenca] Desconectado");
      window.dispatchEvent(new CustomEvent('presenca:offline'));
    };

    stompClient.onWebSocketClose = () => {
      console.log("[Presenca] WebSocket fechado");

      // Tentar reconectar
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`[Presenca] Tentando reconectar... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        setTimeout(() => {
          const token = localStorage.getItem("userToken");
          if (token) conectarWebSocket(token);
        }, 5000 * reconnectAttempts);
      }
    };

    stompClient.activate();
  }

  // Desconectar ao sair da pagina
  window.addEventListener('beforeunload', () => {
    if (stompClient && stompClient.connected) {
      stompClient.deactivate();
    }
  });

  // Expor funcoes globais
  window.presencaGlobal = {
    init: initPresenca,
    isConnected: () => stompClient && stompClient.connected,
    getClient: () => stompClient
  };

  // Auto-inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPresenca);
  } else {
    initPresenca();
  }

})();
