// URL vem do config.js (importado no HTML)

const $ = (sel) => document.querySelector(sel);

const form = $("#loginForm");
const emailInput = $("#email");
const senhaInput = $("#senha");
const btnLogin = $("#btnLogin");
const btnText = $(".btn-text");
const btnLoading = $(".btn-loading");
const errorMessage = $("#errorMessage");
const errorMessageText = $("#errorMessage span");
const togglePasswordBtn = $(".toggle-password");

// Toggle mostrar/esconder senha
togglePasswordBtn?.addEventListener("click", () => {
  const type = senhaInput.type === "password" ? "text" : "password";
  senhaInput.type = type;
  togglePasswordBtn.querySelector("i").className =
    type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
});

// Função para mostrar erro
function showError(message) {
  errorMessageText.textContent = message;
  errorMessage.hidden = false;
}

// Função para esconder erro
function hideError() {
  errorMessage.hidden = true;
  errorMessageText.textContent = "";
}

// Função para mostrar loading
function setLoading(loading) {
  btnLogin.disabled = loading;
  btnText.hidden = loading;
  btnLoading.hidden = !loading;
}

// Função de login
async function login(email, senha) {
  const resp = await fetch(`${BFF_BASE_URL}/bff/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,  // BFF aceita email no campo 'email'
      senha: senha
    })
  });

  // Tratar erro 429 (Too Many Requests)
  if (resp.status === 429) {
    throw new Error("Muitas tentativas de login. Aguarde um minuto e tente novamente.");
  }

  // Tratar erro 500 ou outros erros de servidor
  if (resp.status >= 500) {
    throw new Error("Servidor indisponível. Tente novamente mais tarde.");
  }

  // Tentar parsear JSON
  let json;
  try {
    json = await resp.json();
  } catch (e) {
    throw new Error("Erro de comunicação com o servidor. Tente novamente.");
  }

  if (!json.success) {
    throw new Error(json.message || "Erro ao fazer login");
  }

  return json.data;
}

// Submit do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!email || !senha) {
    showError("Preencha todos os campos");
    return;
  }

  try {
    setLoading(true);

    const userData = await login(email, senha);

    // Salvar dados do usuário no localStorage
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("userName", userData.nome);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userToken", userData.token);
    localStorage.setItem("isLoggedIn", "true");

    // Redirecionar para a home/perfil
    window.location.href = "/views/perfil/index.html";

  } catch (err) {
    console.error("Erro ao fazer login:", err);
    showError(err.message);
    setLoading(false);
  }
});

// Verificar se já está logado
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    window.location.href = "/views/perfil/index.html";
  }
});
