// ============================================
// CONFIGURAÇÃO CENTRALIZADA DE URLs
// Altere aqui para trocar entre local e produção
// ============================================

const CONFIG = {
  // Para desenvolvimento local:
  // BFF_BASE_URL: "http://localhost:8000/api",
  // BACKEND_URL: "http://localhost:8080",
  // WS_URL: "http://localhost:8080/ws",

  // Para produção (Railway):
  BFF_BASE_URL: "https://fictional-system-bff-gym-production.up.railway.app/api",
  BACKEND_URL: "https://fictional-system-back-end-gym-production.up.railway.app",
  WS_URL: "https://fictional-system-back-end-gym-production.up.railway.app/ws",
};

// Exporta as variáveis globais para compatibilidade
const BFF_BASE_URL = CONFIG.BFF_BASE_URL;
const BACKEND_URL = CONFIG.BACKEND_URL;
const WS_URL = CONFIG.WS_URL;
